import { NextResponse } from "next/server";
import { getContestState } from "@/lib/contest";

export const dynamic = "force-dynamic";

/** Public contest schedule (countdown + open/closed). */
export async function GET() {
  try {
    const contest = await getContestState();
    return NextResponse.json(contest, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
