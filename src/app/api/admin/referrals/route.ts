import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";

/**
 * List all registered users with referral stats for the admin panel.
 */
export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const fullSelect =
      "id, full_name, department, level, niche, skill_level, phone, x_handle, telegram_username, ref_code, referred_by, previous_referred_by, referral_status, referral_source, referral_reviewed_at, referral_reviewed_by, referral_review_reason, joined_ledger, joined_fbc, followed_x, created_at";
    const legacySelect =
      "id, full_name, department, level, niche, skill_level, phone, x_handle, telegram_username, ref_code, referred_by, joined_ledger, joined_fbc, followed_x, created_at";

    let rawRows: Record<string, unknown>[] | null = null;
    let error: { message: string } | null = null;

    {
      const res = await supabase
        .from("signups")
        .select(fullSelect)
        .order("created_at", { ascending: false });
      if (res.error && /column|schema cache/i.test(res.error.message || "")) {
        const legacy = await supabase
          .from("signups")
          .select(legacySelect)
          .order("created_at", { ascending: false });
        error = legacy.error;
        rawRows = (legacy.data as Record<string, unknown>[] | null) || null;
      } else {
        error = res.error;
        rawRows = (res.data as Record<string, unknown>[] | null) || null;
      }
    }

    if (error) {
      console.error("admin referrals list:", error);
      return NextResponse.json(
        {
          error:
            error.message +
            " — apply migration 20260728140000_referral_moderation.sql in Supabase SQL editor.",
        },
        { status: 500 }
      );
    }

    const rows = (rawRows || []).map((r) => {
      const referred_by = (r.referred_by as string | null) || null;
      return {
        previous_referred_by: null as string | null,
        referral_status: referred_by ? "pending" : null,
        referral_source: referred_by ? "referral_link" : null,
        referral_reviewed_at: null as string | null,
        referral_reviewed_by: null as string | null,
        referral_review_reason: null as string | null,
        ...r,
        referred_by,
      } as {
        id: string;
        full_name: string;
        department: string;
        level: string;
        niche: string;
        skill_level: string;
        phone: string;
        x_handle: string;
        telegram_username: string;
        ref_code: string;
        referred_by: string | null;
        previous_referred_by: string | null;
        referral_status: string | null;
        referral_source: string | null;
        referral_reviewed_at: string | null;
        referral_reviewed_by: string | null;
        referral_review_reason: string | null;
        joined_ledger: boolean;
        joined_fbc: boolean;
        followed_x: boolean;
        created_at: string;
      };
    });

    // Build counts from referred rows
    const verifiedCounts = new Map<string, number>();
    const pendingCounts = new Map<string, number>();
    const rejectedCounts = new Map<string, number>();
    const totalGiven = new Map<string, number>(); // all with referred_by still set

    for (const r of rows) {
      if (!r.referred_by) continue;
      totalGiven.set(
        r.referred_by,
        (totalGiven.get(r.referred_by) || 0) + 1
      );
      if (r.referral_status === "verified") {
        verifiedCounts.set(
          r.referred_by,
          (verifiedCounts.get(r.referred_by) || 0) + 1
        );
      } else if (r.referral_status === "pending" || !r.referral_status) {
        pendingCounts.set(
          r.referred_by,
          (pendingCounts.get(r.referred_by) || 0) + 1
        );
      } else if (r.referral_status === "rejected") {
        rejectedCounts.set(
          r.referred_by,
          (rejectedCounts.get(r.referred_by) || 0) + 1
        );
      }
    }

    const users = rows.map((r) => {
      const verified = verifiedCounts.get(r.ref_code) || 0;
      const pending = pendingCounts.get(r.ref_code) || 0;
      const rejected = rejectedCounts.get(r.ref_code) || 0;
      const active_referrals = totalGiven.get(r.ref_code) || 0;

      // Status of THIS user as a referral credit
      let inbound_status: string | null = r.referral_status ?? null;
      if (!r.referred_by && !inbound_status) inbound_status = null;

      return {
        ...r,
        inbound_status,
        referral_totals: {
          active: active_referrals,
          verified,
          pending,
          rejected,
          /** Leaderboard score: pending + verified (not rejected) */
          countable: verified + pending,
        },
        // Flags for suspicious-activity heuristics
        flags: {
          has_pending_outbound: pending > 0,
          high_pending: pending >= 3,
          self_ref_possible: false as boolean,
        },
      };
    });

    // Simple self-referral flag: same phone/handle as someone they referred — computed lightly
    const byCode = new Map(rows.map((r) => [r.ref_code, r]));
    for (const u of users) {
      if (!u.referred_by) continue;
      const referrer = byCode.get(u.referred_by);
      if (!referrer) continue;
      if (
        (u.phone && referrer.phone && u.phone === referrer.phone) ||
        (u.x_handle &&
          referrer.x_handle &&
          u.x_handle.toLowerCase() === referrer.x_handle.toLowerCase()) ||
        (u.telegram_username &&
          referrer.telegram_username &&
          u.telegram_username.toLowerCase() ===
            referrer.telegram_username.toLowerCase())
      ) {
        u.flags.self_ref_possible = true;
      }
    }

    return NextResponse.json(
      { users },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
