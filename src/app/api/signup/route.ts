import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { generateRefCode } from "@/lib/ref-code";
import { LEVELS, NICHES, SKILL_LEVELS } from "@/lib/constants";
import { normalizePhone } from "@/lib/phone";
import { isValidHandle, normalizeHandle } from "@/lib/normalize-identity";

type Body = {
  full_name?: string;
  department?: string;
  level?: string;
  niche?: string;
  skill_level?: string;
  phone?: string;
  x_handle?: string;
  telegram_username?: string;
  referred_by?: string | null;
  joined_ledger?: boolean;
  joined_fbc?: boolean;
  followed_x?: boolean;
};

/** Simple in-memory rate limit: max signups per IP per window (serverless-friendly soft guard). */
const rateBucket = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

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

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many signup attempts from this network. Try again later." },
      { status: 429 }
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const full_name = String(body.full_name || "").trim();
  const department = String(body.department || "").trim();
  const level = String(body.level || "").trim();
  const niche = String(body.niche || "").trim();
  const skill_level = String(body.skill_level || "").trim();
  const phone = normalizePhone(String(body.phone || ""));
  const x_handle = normalizeHandle(String(body.x_handle || ""));
  const telegram_username = normalizeHandle(String(body.telegram_username || ""));
  const referred_by_raw = body.referred_by
    ? String(body.referred_by).trim()
    : null;
  const joined_ledger = Boolean(body.joined_ledger);
  const joined_fbc = Boolean(body.joined_fbc);
  const followed_x = Boolean(body.followed_x);

  if (
    !full_name ||
    !department ||
    !level ||
    !niche ||
    !skill_level ||
    !phone ||
    !x_handle ||
    !telegram_username
  ) {
    return NextResponse.json(
      {
        error: !phone
          ? "Enter a valid phone number (e.g. 0801 234 5678 or +234…)"
          : "Missing required fields",
      },
      { status: 400 }
    );
  }

  if (!isValidHandle(x_handle)) {
    return NextResponse.json(
      { error: "X handle looks invalid (use 3–32 letters, numbers, _ or .)" },
      { status: 400 }
    );
  }
  if (!isValidHandle(telegram_username)) {
    return NextResponse.json(
      { error: "Telegram username looks invalid" },
      { status: 400 }
    );
  }

  if (!(LEVELS as readonly string[]).includes(level)) {
    return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }
  if (!(NICHES as readonly string[]).includes(niche)) {
    return NextResponse.json({ error: "Invalid niche" }, { status: 400 });
  }
  if (!(SKILL_LEVELS as readonly string[]).includes(skill_level)) {
    return NextResponse.json({ error: "Invalid skill level" }, { status: 400 });
  }
  if (!joined_ledger || !joined_fbc || !followed_x) {
    return NextResponse.json(
      { error: "Complete all social verification steps first" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    // Pre-check duplicates with friendly messages (also enforced by unique indexes)
    const { data: dupPhone } = await supabase
      .from("signups")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    if (dupPhone) {
      return NextResponse.json(
        {
          error:
            "This phone number is already registered. Each person may only sign up once.",
        },
        { status: 409 }
      );
    }

    const { data: dupX } = await supabase
      .from("signups")
      .select("id")
      .ilike("x_handle", x_handle)
      .maybeSingle();
    if (dupX) {
      return NextResponse.json(
        { error: "This X handle is already registered." },
        { status: 409 }
      );
    }

    const { data: dupTg } = await supabase
      .from("signups")
      .select("id")
      .ilike("telegram_username", telegram_username)
      .maybeSingle();
    if (dupTg) {
      return NextResponse.json(
        { error: "This Telegram username is already registered." },
        { status: 409 }
      );
    }

    // Validate referred_by exists; ignore invalid codes (don't invent free referrals)
    let referred_by: string | null = null;
    if (referred_by_raw) {
      // Block obviously bogus short codes
      if (referred_by_raw.length < 4 || referred_by_raw.length > 16) {
        return NextResponse.json(
          { error: "Invalid referral code" },
          { status: 400 }
        );
      }
      const { data: referrer } = await supabase
        .from("signups")
        .select("ref_code, phone, x_handle, telegram_username")
        .eq("ref_code", referred_by_raw)
        .maybeSingle();
      if (referrer) {
        // Same identity cannot "refer" themselves via a second account sharing phone/handle
        // (already blocked by unique phone/handle; still clear if they match referrer)
        if (
          referrer.phone === phone ||
          (referrer.x_handle &&
            normalizeHandle(referrer.x_handle) === x_handle) ||
          (referrer.telegram_username &&
            normalizeHandle(referrer.telegram_username) === telegram_username)
        ) {
          return NextResponse.json(
            { error: "Self-referral is not allowed." },
            { status: 400 }
          );
        }
        referred_by = referrer.ref_code;
      }
      // Invalid code → ignore (signup still allowed without credit)
    }

    let ref_code = generateRefCode();
    let inserted = null as { ref_code: string } | null;
    let lastError: string | null = null;

    for (let attempt = 0; attempt < 5; attempt++) {
      const baseRow = {
        full_name,
        department,
        level,
        niche,
        skill_level,
        phone,
        x_handle,
        telegram_username,
        ref_code,
        referred_by,
        joined_ledger,
        joined_fbc,
        followed_x,
      };
      // Prefer moderation columns; fall back if migration not yet applied
      let data: { ref_code: string } | null = null;
      let error: { message?: string; code?: string } | null = null;

      {
        const res = await supabase
          .from("signups")
          .insert({
            ...baseRow,
            referral_status: referred_by ? "pending" : null,
            referral_source: referred_by ? "referral_link" : null,
          })
          .select("ref_code")
          .single();
        data = res.data;
        error = res.error;
      }

      if (
        error &&
        /referral_status|referral_source|schema cache|column/i.test(
          error.message || ""
        )
      ) {
        const res = await supabase
          .from("signups")
          .insert(baseRow)
          .select("ref_code")
          .single();
        data = res.data;
        error = res.error;
      }

      if (!error && data) {
        inserted = data;
        break;
      }

      if (error?.code === "23505") {
        const msg = error.message || "";
        if (msg.includes("ref_code")) {
          ref_code = generateRefCode();
          lastError = error.message || "ref_code conflict";
          continue;
        }
        if (msg.includes("phone")) {
          return NextResponse.json(
            {
              error:
                "This phone number is already registered. Each person may only sign up once.",
            },
            { status: 409 }
          );
        }
        if (msg.includes("x_handle")) {
          return NextResponse.json(
            { error: "This X handle is already registered." },
            { status: 409 }
          );
        }
        if (msg.includes("telegram")) {
          return NextResponse.json(
            { error: "This Telegram username is already registered." },
            { status: 409 }
          );
        }
      }

      lastError = error?.message || "Insert failed";
      break;
    }

    if (!inserted) {
      console.error("signup insert failed:", lastError);
      const msg = lastError || "Could not create signup";
      // Surface clearer copy for constraint failures (migration vs app mismatch, etc.)
      if (/null value in column "phone"/i.test(msg)) {
        return NextResponse.json(
          {
            error:
              "Phone number is required. Please enter a valid Nigerian phone number.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ ref_code: inserted.ref_code });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
