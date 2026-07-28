import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getContestState, setContestEndsAt } from "@/lib/contest";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function actor(): string {
  return process.env.ADMIN_DISPLAY_NAME?.trim() || "admin";
}

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const contest = await getContestState();
    return NextResponse.json(
      { contest },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}

/**
 * Body:
 *  { action: "end_now" }
 *  { action: "extend", ends_at: ISO string }  // absolute new end
 *  { action: "extend_days", days: number }    // add days to current end (or now if already closed)
 *  { action: "set", ends_at: ISO string }
 */
export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    action?: string;
    ends_at?: string;
    days?: number;
    reason?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = String(body.action || "").trim();
  const reason = String(body.reason || "").trim();
  const who = actor();

  try {
    const current = await getContestState();
    let nextEnds: Date;

    if (action === "end_now") {
      nextEnds = new Date();
    } else if (action === "set" || action === "extend") {
      const raw = String(body.ends_at || "").trim();
      if (!raw) {
        return NextResponse.json(
          { error: "ends_at is required (ISO date)" },
          { status: 400 }
        );
      }
      nextEnds = new Date(raw);
      if (Number.isNaN(nextEnds.getTime())) {
        return NextResponse.json({ error: "Invalid ends_at" }, { status: 400 });
      }
      if (action === "extend" && nextEnds.getTime() <= Date.now()) {
        return NextResponse.json(
          { error: "New end time must be in the future to extend" },
          { status: 400 }
        );
      }
    } else if (action === "extend_days") {
      const days = Number(body.days);
      if (!Number.isFinite(days) || days <= 0 || days > 365) {
        return NextResponse.json(
          { error: "days must be a number between 1 and 365" },
          { status: 400 }
        );
      }
      const baseMs = Math.max(
        Date.now(),
        new Date(current.ends_at).getTime()
      );
      nextEnds = new Date(baseMs + days * 24 * 60 * 60 * 1000);
    } else {
      return NextResponse.json(
        {
          error:
            "action must be end_now | extend | extend_days | set",
        },
        { status: 400 }
      );
    }

    const contest = await setContestEndsAt(nextEnds, who);

    // Audit (best-effort if table exists)
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("admin_audit_log").insert({
        admin_actor: who,
        action: `contest_${action}`,
        target_signup_id: null,
        target_ref_code: null,
        referrer_ref_code: null,
        reason:
          reason ||
          (action === "end_now"
            ? "Contest ended by admin"
            : `Contest schedule updated to ${contest.ends_at}`),
        metadata: {
          previous_ends_at: current.ends_at,
          new_ends_at: contest.ends_at,
          action,
        },
      });
    } catch (e) {
      console.error("contest audit:", e);
    }

    return NextResponse.json(
      { ok: true, contest },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : "Failed to update contest — run contest_settings migration?",
      },
      { status: 500 }
    );
  }
}
