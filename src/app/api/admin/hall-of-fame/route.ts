import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!isAdminAuthenticated()) return unauthorized();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("hall_of_fame")
    .select("*")
    .order("prize_usd", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data || [] });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) return unauthorized();
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseEntry(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("hall_of_fame")
    .insert({ ...parsed.row, updated_at: new Date().toISOString() })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data });
}

export async function PUT(req: NextRequest) {
  if (!isAdminAuthenticated()) return unauthorized();
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = String(body.id || "").trim();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const parsed = parseEntry(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("hall_of_fame")
    .update({ ...parsed.row, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated()) return unauthorized();
  const id = req.nextUrl.searchParams.get("id")?.trim();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("hall_of_fame").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

function parseEntry(body: Record<string, unknown>) {
  const name = String(body.name || "").trim();
  const achievement = String(body.achievement || "").trim();
  const date = String(body.date || "").trim();
  const prize_usd = Number(body.prize_usd);
  if (!name || !achievement || !date) {
    return { error: "Name, achievement, and date are required" };
  }
  if (!Number.isFinite(prize_usd) || prize_usd < 100) {
    return { error: "Prize must be a number ≥ 100" };
  }
  return {
    row: {
      name,
      achievement,
      prize_usd,
      date,
      project_url: body.project_url ? String(body.project_url).trim() : null,
      description: body.description ? String(body.description).trim() : null,
      sort_order: Number.isFinite(Number(body.sort_order))
        ? Number(body.sort_order)
        : 0,
    },
  };
}
