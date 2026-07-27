import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { generateRefCode } from "@/lib/ref-code";
import { LEVELS, NICHES, SKILL_LEVELS } from "@/lib/constants";

type Body = {
  full_name?: string;
  department?: string;
  level?: string;
  niche?: string;
  skill_level?: string;
  x_handle?: string;
  telegram_username?: string;
  referred_by?: string | null;
  joined_ledger?: boolean;
  joined_fbc?: boolean;
  followed_x?: boolean;
};

function cleanHandle(v: string): string {
  return v.trim().replace(/^@+/, "");
}

export async function POST(req: NextRequest) {
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
  const x_handle = cleanHandle(String(body.x_handle || ""));
  const telegram_username = cleanHandle(String(body.telegram_username || ""));
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
    !x_handle ||
    !telegram_username
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    // Validate referred_by exists; ignore if not
    let referred_by: string | null = null;
    if (referred_by_raw) {
      const { data: referrer } = await supabase
        .from("signups")
        .select("ref_code")
        .eq("ref_code", referred_by_raw)
        .maybeSingle();
      if (referrer) referred_by = referrer.ref_code;
    }

    // Generate unique ref_code with retries
    let ref_code = generateRefCode();
    let inserted = null as { ref_code: string } | null;
    let lastError: string | null = null;

    for (let attempt = 0; attempt < 5; attempt++) {
      const { data, error } = await supabase
        .from("signups")
        .insert({
          full_name,
          department,
          level,
          niche,
          skill_level,
          x_handle,
          telegram_username,
          ref_code,
          referred_by,
          joined_ledger,
          joined_fbc,
          followed_x,
        })
        .select("ref_code")
        .single();

      if (!error && data) {
        inserted = data;
        break;
      }

      // Unique violation on ref_code → retry
      if (error?.code === "23505" && error.message?.includes("ref_code")) {
        ref_code = generateRefCode();
        lastError = error.message;
        continue;
      }

      // Duplicate handle-ish not enforced; surface other errors
      lastError = error?.message || "Insert failed";
      break;
    }

    if (!inserted) {
      console.error("signup insert failed:", lastError);
      return NextResponse.json(
        { error: lastError || "Could not create signup" },
        { status: 500 }
      );
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
