import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const SELECT_FULL =
  "id, full_name, department, level, niche, skill_level, phone, x_handle, telegram_username, ref_code, referred_by, previous_referred_by, referral_status, referral_source, referral_reviewed_at, referral_reviewed_by, referral_review_reason, joined_ledger, joined_fbc, followed_x, created_at";

/**
 * Full profile for one signup + referrer + people they referred.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: user, error } = await supabase
      .from("signups")
      .select(SELECT_FULL)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let referrer = null as Record<string, unknown> | null;
    if (user.referred_by) {
      const { data: ref } = await supabase
        .from("signups")
        .select(SELECT_FULL)
        .eq("ref_code", user.referred_by)
        .maybeSingle();
      referrer = ref;
    } else if (user.previous_referred_by) {
      const { data: ref } = await supabase
        .from("signups")
        .select(SELECT_FULL)
        .eq("ref_code", user.previous_referred_by)
        .maybeSingle();
      referrer = ref
        ? { ...ref, _note: "Previous referrer (credit removed)" }
        : null;
    }

    const { data: referred } = await supabase
      .from("signups")
      .select(SELECT_FULL)
      .eq("referred_by", user.ref_code)
      .order("created_at", { ascending: false });

    // Also include removed history? only those still linked.
    // Optional: people who had previous_referred_by = this code
    const { data: formerlyReferred } = await supabase
      .from("signups")
      .select(SELECT_FULL)
      .eq("previous_referred_by", user.ref_code)
      .is("referred_by", null)
      .order("created_at", { ascending: false });

    const { data: audit } = await supabase
      .from("admin_audit_log")
      .select(
        "id, admin_actor, action, target_signup_id, target_ref_code, referrer_ref_code, reason, metadata, created_at"
      )
      .or(
        `target_signup_id.eq.${user.id},target_ref_code.eq.${user.ref_code},referrer_ref_code.eq.${user.ref_code}`
      )
      .order("created_at", { ascending: false })
      .limit(50);

    const referredList = referred || [];
    const verified = referredList.filter(
      (r) => r.referral_status === "verified"
    ).length;
    const pending = referredList.filter(
      (r) => r.referral_status === "pending" || !r.referral_status
    ).length;
    const rejected = referredList.filter(
      (r) => r.referral_status === "rejected"
    ).length;

    return NextResponse.json(
      {
        user,
        referrer,
        referrals: referredList,
        formerly_referred: formerlyReferred || [],
        totals: {
          active: referredList.length,
          verified,
          pending,
          rejected,
          countable: verified,
          removed_history: (formerlyReferred || []).length,
        },
        audit: audit || [],
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
