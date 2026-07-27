import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

/**
 * Lightweight keep-alive for Supabase free-tier inactivity pause.
 * Hit every few days via GitHub Actions — only counts participants (no PII).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { count, error } = await supabase
      .from("signups")
      .select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, at: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      participants: count ?? 0,
      at: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "keepalive failed",
        at: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
