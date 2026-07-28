import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ACTIONS = ["verify", "reject", "remove"] as const;
type Action = (typeof ACTIONS)[number];

function adminActor(): string {
  return process.env.ADMIN_DISPLAY_NAME?.trim() || "admin";
}

/**
 * Moderate a referral credit on a signup (the referred person).
 * Body: { signup_id, action: verify|reject|remove, reason }
 */
export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    signup_id?: string;
    action?: string;
    reason?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const signup_id = String(body.signup_id || "").trim();
  const action = String(body.action || "").trim() as Action;
  const reason = String(body.reason || "").trim();

  if (!signup_id) {
    return NextResponse.json({ error: "signup_id is required" }, { status: 400 });
  }
  if (!ACTIONS.includes(action)) {
    return NextResponse.json(
      { error: "action must be verify, reject, or remove" },
      { status: 400 }
    );
  }
  if (reason.length < 3) {
    return NextResponse.json(
      { error: "Reason is required (at least 3 characters)" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: row, error: fetchErr } = await supabase
      .from("signups")
      .select(
        "id, ref_code, referred_by, previous_referred_by, referral_status, full_name"
      )
      .eq("id", signup_id)
      .maybeSingle();

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }
    if (!row) {
      return NextResponse.json({ error: "Signup not found" }, { status: 404 });
    }

    const actor = adminActor();
    const now = new Date().toISOString();

    if (action === "verify" || action === "reject") {
      if (!row.referred_by) {
        return NextResponse.json(
          {
            error:
              "This signup has no active referrer. Cannot verify/reject — use remove only after a referral exists, or re-link is not supported.",
          },
          { status: 400 }
        );
      }

      const nextStatus = action === "verify" ? "verified" : "rejected";
      const { data: updated, error: upErr } = await supabase
        .from("signups")
        .update({
          referral_status: nextStatus,
          referral_reviewed_at: now,
          referral_reviewed_by: actor,
          referral_review_reason: reason,
        })
        .eq("id", signup_id)
        .select(
          "id, ref_code, referred_by, referral_status, referral_reviewed_at, referral_reviewed_by, referral_review_reason"
        )
        .single();

      if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }

      await writeAudit(supabase, {
        admin_actor: actor,
        action: action === "verify" ? "referral_verify" : "referral_reject",
        target_signup_id: signup_id,
        target_ref_code: row.ref_code,
        referrer_ref_code: row.referred_by,
        reason,
        metadata: {
          previous_status: row.referral_status,
          new_status: nextStatus,
          referred_name: row.full_name,
        },
      });

      return NextResponse.json(
        { ok: true, signup: updated },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    // remove — invalidate credit: clear referred_by, mark removed
    if (!row.referred_by && row.referral_status === "removed") {
      return NextResponse.json(
        { error: "Referral credit already removed" },
        { status: 400 }
      );
    }
    if (!row.referred_by) {
      return NextResponse.json(
        { error: "No active referral credit to remove" },
        { status: 400 }
      );
    }

    const prevReferrer = row.referred_by;
    const { data: updated, error: upErr } = await supabase
      .from("signups")
      .update({
        previous_referred_by: prevReferrer,
        referred_by: null,
        referral_status: "removed",
        referral_reviewed_at: now,
        referral_reviewed_by: actor,
        referral_review_reason: reason,
      })
      .eq("id", signup_id)
      .select(
        "id, ref_code, referred_by, previous_referred_by, referral_status, referral_reviewed_at, referral_reviewed_by, referral_review_reason"
      )
      .single();

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    await writeAudit(supabase, {
      admin_actor: actor,
      action: "referral_remove",
      target_signup_id: signup_id,
      target_ref_code: row.ref_code,
      referrer_ref_code: prevReferrer,
      reason,
      metadata: {
        previous_status: row.referral_status,
        previous_referred_by: prevReferrer,
        referred_name: row.full_name,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        signup: updated,
        message:
          "Referral credit removed. Referrer’s leaderboard count no longer includes this signup.",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}

async function writeAudit(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  row: {
    admin_actor: string;
    action: string;
    target_signup_id: string;
    target_ref_code: string;
    referrer_ref_code: string | null;
    reason: string;
    metadata: Record<string, unknown>;
  }
) {
  const { error } = await supabase.from("admin_audit_log").insert({
    admin_actor: row.admin_actor,
    action: row.action,
    target_signup_id: row.target_signup_id,
    target_ref_code: row.target_ref_code,
    referrer_ref_code: row.referrer_ref_code,
    reason: row.reason,
    metadata: row.metadata,
  });
  if (error) {
    console.error("audit log insert failed:", error);
    // Don't fail the main action if audit insert fails after update —
    // but surface a warning. Prefer strict: rethrow.
    throw new Error(`Action applied but audit log failed: ${error.message}`);
  }
}
