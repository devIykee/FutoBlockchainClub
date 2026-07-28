import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { anonymizeName } from "@/lib/anonymize";
import type { LeaderboardEntry, LeaderboardStats } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Public leaderboard — active referrals count (pending + verified).
 * Rejected / removed credits do not count (admin moderation).
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    let entries: LeaderboardEntry[] = [];
    let total_participants = 0;
    let total_referrals = 0;

    const { data: all, error } = await supabase
      .from("signups")
      .select("ref_code, full_name, referred_by, referral_status");

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = all || [];
    total_participants = rows.length;
    const counts = new Map<string, number>();
    for (const r of rows) {
      if (!r.referred_by) continue;
      // Active credit: pending or verified. Rejected stays linked but does not score.
      // removed has referred_by cleared so it never reaches here.
      const status = r.referral_status || "pending";
      if (status === "rejected" || status === "removed") continue;
      counts.set(r.referred_by, (counts.get(r.referred_by) || 0) + 1);
    }
    const countPairs = Array.from(counts.entries());
    total_referrals = countPairs.reduce((s, [, n]) => s + n, 0);

    const byCode = new Map(rows.map((r) => [r.ref_code, r.full_name]));
    entries = countPairs
      .map(([ref_code, referral_count]) => ({
        ref_code,
        referral_count,
        display_name: anonymizeName(byCode.get(ref_code) || "Unknown"),
        rank: 0,
      }))
      .sort((a, b) => b.referral_count - a.referral_count)
      .map((e, i) => ({ ...e, rank: i + 1 }));

    const payload: LeaderboardStats = {
      total_participants,
      total_referrals,
      entries,
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
