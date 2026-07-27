import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { TEAM } from "@/content/team";

export const dynamic = "force-dynamic";

/** Public list of core team members (ordered). Falls back to static seed if DB empty/unavailable. */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("team_members")
      .select("id, name, role, photo, x, github, linkedin, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return NextResponse.json({ members: seedMembers(), source: "seed" });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ members: seedMembers(), source: "seed" });
    }

    return NextResponse.json(
      { members: data, source: "db" },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ members: seedMembers(), source: "seed" });
  }
}

function seedMembers() {
  return TEAM.map((m, i) => ({
    id: `seed-${i}`,
    name: m.name,
    role: m.role,
    photo: m.photo ?? null,
    x: m.x ?? null,
    github: m.github ?? null,
    linkedin: m.linkedin ?? null,
    sort_order: i,
  }));
}
