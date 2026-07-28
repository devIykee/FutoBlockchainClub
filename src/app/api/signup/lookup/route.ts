import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/phone";

export const dynamic = "force-dynamic";

/** Soft IP rate limit for phone lookups (enumeration guard). */
const rateBucket = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || now > entry.reset) {
    rateBucket.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

/**
 * Recover a registration by phone number.
 * Returns profile + ref code so the user can re-open their referral link.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many lookup attempts. Try again later." },
      { status: 429, headers: { "Cache-Control": "no-store" } }
    );
  }

  let body: { phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const phone = normalizePhone(String(body.phone || ""));
  if (!phone) {
    return NextResponse.json(
      {
        error:
          "Enter a valid phone number (e.g. 0801 234 5678 or +234…)",
      },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from("signups")
      .select(
        "ref_code, full_name, phone, department, level, niche, skill_level, x_handle, telegram_username, referred_by, created_at"
      )
      .eq("phone", phone)
      .maybeSingle();

    if (error) {
      console.error("signup lookup:", error);
      return NextResponse.json(
        { error: "Could not look up registration" },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }

    if (!row) {
      return NextResponse.json(
        {
          error:
            "No registration found for that phone number. Check the number or sign up if you haven't yet.",
        },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    // People who used this user's referral code (no PII beyond what they shared at signup)
    const { data: referredRows, error: refErr } = await supabase
      .from("signups")
      .select(
        "full_name, department, level, niche, created_at, referral_status"
      )
      .eq("referred_by", row.ref_code)
      .order("created_at", { ascending: false });

    if (refErr) {
      console.error("signup referrals:", refErr);
    }

    const referrals = (referredRows || []).map((r) => ({
      full_name: r.full_name as string,
      department: (r.department as string) || undefined,
      level: (r.level as string) || undefined,
      niche: (r.niche as string) || undefined,
      created_at: (r.created_at as string) || undefined,
      status: (r.referral_status as string) || "pending",
    }));

    // Leaderboard score: pending + verified (not rejected)
    const countable = referrals.filter(
      (r) => r.status !== "rejected" && r.status !== "removed"
    ).length;

    return NextResponse.json(
      {
        registration: {
          ref_code: row.ref_code,
          full_name: row.full_name,
          phone: row.phone,
          department: row.department,
          level: row.level,
          niche: row.niche,
          skill_level: row.skill_level,
          x_handle: row.x_handle,
          telegram_username: row.telegram_username,
          referred_by: row.referred_by,
          created_at: row.created_at,
          /** Active referrals that count on the leaderboard */
          referral_count: countable,
          /** All referrals with status for the portal */
          referrals,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
