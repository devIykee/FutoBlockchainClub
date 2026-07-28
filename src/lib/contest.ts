import { CONTEST_END_DEFAULT } from "@/lib/constants";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type ContestState = {
  ends_at: string;
  is_open: boolean;
  ms_remaining: number;
  updated_at?: string | null;
  updated_by?: string | null;
};

/** Read contest end from DB; fall back to code default. */
export async function getContestState(): Promise<ContestState> {
  const fallbackIso = CONTEST_END_DEFAULT.toISOString();
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("contest_settings")
      .select("ends_at, updated_at, updated_by")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data?.ends_at) {
      return stateFromIso(fallbackIso);
    }

    return {
      ...stateFromIso(String(data.ends_at)),
      updated_at: data.updated_at ? String(data.updated_at) : null,
      updated_by: data.updated_by ? String(data.updated_by) : null,
    };
  } catch {
    return stateFromIso(fallbackIso);
  }
}

export function stateFromIso(endsAtIso: string): ContestState {
  const endMs = new Date(endsAtIso).getTime();
  const now = Date.now();
  const ms_remaining = Math.max(0, endMs - now);
  return {
    ends_at: new Date(endMs).toISOString(),
    is_open: ms_remaining > 0,
    ms_remaining,
  };
}

export async function setContestEndsAt(
  endsAt: Date,
  updatedBy: string
): Promise<ContestState> {
  const supabase = getSupabaseAdmin();
  const iso = endsAt.toISOString();
  const { data, error } = await supabase
    .from("contest_settings")
    .upsert(
      {
        id: 1,
        ends_at: iso,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      },
      { onConflict: "id" }
    )
    .select("ends_at, updated_at, updated_by")
    .single();

  if (error) throw new Error(error.message);
  return {
    ...stateFromIso(String(data.ends_at)),
    updated_at: data.updated_at ? String(data.updated_at) : null,
    updated_by: data.updated_by ? String(data.updated_by) : null,
  };
}
