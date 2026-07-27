import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { anonymizeName } from "@/lib/anonymize";
import type { LeaderboardEntry, LeaderboardStats } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    // Prefer the secure view if available; fall back to server-side aggregation
    const { data: viewRows, error: viewError } = await supabase
      .from("leaderboard")
      .select("ref_code, full_name, referral_count")
      .order("referral_count", { ascending: false });

    let entries: LeaderboardEntry[] = [];
    let total_participants = 0;
    let total_referrals = 0;

    if (!viewError && viewRows) {
      entries = viewRows.map((row, i) => ({
        rank: i + 1,
        display_name: anonymizeName(row.full_name as string),
        referral_count: Number(row.referral_count) || 0,
        ref_code: row.ref_code as string,
      }));
      total_referrals = entries.reduce((s, e) => s + e.referral_count, 0);
    } else {
      // Fallback aggregation without exposing PII to client
      const { data: all, error } = await supabase
        .from("signups")
        .select("ref_code, full_name, referred_by");

      if (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const rows = all || [];
      total_participants = rows.length;
      const counts = new Map<string, number>();
      for (const r of rows) {
        if (r.referred_by) {
          counts.set(r.referred_by, (counts.get(r.referred_by) || 0) + 1);
        }
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
    }

    // Participant count if not set
    if (!total_participants) {
      const { count } = await supabase
        .from("signups")
        .select("*", { count: "exact", head: true });
      total_participants = count || 0;
    }

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
