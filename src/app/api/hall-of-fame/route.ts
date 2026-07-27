import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { HALL_OF_FAME } from "@/content/hall-of-fame";

export const dynamic = "force-dynamic";

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
      return NextResponse.json({ entries: seedEntries(), source: "seed" });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ entries: seedEntries(), source: "seed" });
    }

    return NextResponse.json(
      { entries: data, source: "db" },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ entries: seedEntries(), source: "seed" });
  }
}

function seedEntries() {
  return HALL_OF_FAME.map((e, i) => ({
    id: `seed-${i}`,
    name: e.name,
    achievement: e.achievement,
    prize_usd: e.prizeUsd,
    date: e.date,
    project_url: e.projectUrl ?? null,
    description: e.description ?? null,
    sort_order: i,
  }));
}
