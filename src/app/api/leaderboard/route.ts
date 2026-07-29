import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { anonymizeName } from "@/lib/anonymize";
import { isCountableReferral } from "@/lib/referral-status";
import type { LeaderboardEntry, LeaderboardStats } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Live leaderboard: every referral counts on signup (pending/verified).
 * Rejected/removed do not count. Ranked by count desc.
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data: rows, error } = await supabase
      .from("signups")
      .select("ref_code, full_name, referred_by, referral_status, created_at");

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const all = rows || [];
    const total_participants = all.length;

    const counts = new Map<string, number>();
    for (const r of all) {
      if (!r.referred_by) continue;
      if (!isCountableReferral(r.referral_status)) continue;
      const code = String(r.referred_by);
      counts.set(code, (counts.get(code) || 0) + 1);
    }

    const byCode = new Map(all.map((r) => [String(r.ref_code), r] as const));

    type Row = {
      ref_code: string;
      referral_count: number;
      display_name: string;
      created: string;
    };

    const ranked: Row[] = Array.from(counts.entries())
      .map(([ref_code, referral_count]) => {
        const owner = byCode.get(ref_code);
        return {
          ref_code,
          referral_count,
          display_name: anonymizeName(owner?.full_name || "Unknown"),
          created: owner?.created_at ? String(owner.created_at) : "",
        };
      })
      .sort((a, b) => {
        if (b.referral_count !== a.referral_count) {
          return b.referral_count - a.referral_count;
        }
        return a.created.localeCompare(b.created);
      });

    const entries: LeaderboardEntry[] = ranked.map((e, i) => ({
      ref_code: e.ref_code,
      referral_count: e.referral_count,
      display_name: e.display_name,
      rank: i + 1,
    }));

    const total_referrals = entries.reduce((s, e) => s + e.referral_count, 0);

    const payload: LeaderboardStats = {
      total_participants,
      total_referrals,
      entries,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
