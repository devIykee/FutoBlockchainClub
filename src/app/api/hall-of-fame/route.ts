import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Public Hall of Fame — admin-managed only (no demo seed). */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("hall_of_fame")
      .select(
        "id, name, achievement, prize_usd, date, project_url, description, sort_order"
      )
      .order("prize_usd", { ascending: false })
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: error.message, entries: [] },
        {
          status: 500,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return NextResponse.json(
      { entries: data || [], source: "db" },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Server error",
        entries: [],
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
