import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const full =
      "id, full_name, department, level, niche, skill_level, phone, x_handle, telegram_username, ref_code, referred_by, previous_referred_by, referral_status, referral_source, referral_reviewed_at, referral_reviewed_by, referral_review_reason, joined_ledger, joined_fbc, followed_x, created_at";
    const legacy =
      "id, full_name, department, level, niche, skill_level, phone, x_handle, telegram_username, ref_code, referred_by, joined_ledger, joined_fbc, followed_x, created_at";

    let data: unknown[] | null = null;
    let error: { message: string } | null = null;

    {
      const res = await supabase
        .from("signups")
        .select(full)
        .order("created_at", { ascending: false });
      if (res.error && /column|schema cache/i.test(res.error.message || "")) {
        const legacyRes = await supabase
          .from("signups")
          .select(legacy)
          .order("created_at", { ascending: false });
        error = legacyRes.error;
        data = legacyRes.data;
      } else {
        error = res.error;
        data = res.data;
      }
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { signups: data || [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
