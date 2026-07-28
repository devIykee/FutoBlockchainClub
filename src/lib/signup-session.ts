import { SIGNUP_SESSION_KEY } from "./constants";

/** Lightweight client-side memory of a completed registration. */
export type SignupSession = {
  ref_code: string;
  full_name: string;
  phone?: string;
  department?: string;
  level?: string;
  niche?: string;
  skill_level?: string;
  x_handle?: string;
  telegram_username?: string;
  referred_by?: string | null;
  created_at?: string;
  referral_count?: number;
  saved_at: string;
};

export function readSignupSession(): SignupSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SIGNUP_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SignupSession>;
    if (!parsed.ref_code || !parsed.full_name) return null;
    return {
      ref_code: String(parsed.ref_code),
      full_name: String(parsed.full_name),
      phone: parsed.phone ? String(parsed.phone) : undefined,
      department: parsed.department ? String(parsed.department) : undefined,
      level: parsed.level ? String(parsed.level) : undefined,
      niche: parsed.niche ? String(parsed.niche) : undefined,
      skill_level: parsed.skill_level ? String(parsed.skill_level) : undefined,
      x_handle: parsed.x_handle ? String(parsed.x_handle) : undefined,
      telegram_username: parsed.telegram_username
        ? String(parsed.telegram_username)
        : undefined,
      referred_by:
        parsed.referred_by === null || parsed.referred_by === undefined
          ? parsed.referred_by ?? null
          : String(parsed.referred_by),
      created_at: parsed.created_at ? String(parsed.created_at) : undefined,
      referral_count:
        typeof parsed.referral_count === "number"
          ? parsed.referral_count
          : undefined,
      saved_at: parsed.saved_at
        ? String(parsed.saved_at)
        : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeSignupSession(
  session: Omit<SignupSession, "saved_at"> & { saved_at?: string }
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: SignupSession = {
      ...session,
      saved_at: session.saved_at || new Date().toISOString(),
    };
    localStorage.setItem(SIGNUP_SESSION_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private mode
  }
}

export function clearSignupSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SIGNUP_SESSION_KEY);
  } catch {
    // ignore
  }
}
