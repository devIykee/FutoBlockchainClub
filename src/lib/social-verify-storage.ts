import { SOCIAL_VERIFY_STORAGE_KEY } from "./constants";

export type SocialKey = "ledger" | "fbc" | "x";

export type SocialVerifyState = {
  clicked: Record<SocialKey, boolean>;
  checked: Record<SocialKey, boolean>;
};

const empty: SocialVerifyState = {
  clicked: { ledger: false, fbc: false, x: false },
  checked: { ledger: false, fbc: false, x: false },
};

export function readSocialVerify(): SocialVerifyState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(SOCIAL_VERIFY_STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<SocialVerifyState>;
    return {
      clicked: {
        ledger: Boolean(parsed.clicked?.ledger),
        fbc: Boolean(parsed.clicked?.fbc),
        x: Boolean(parsed.clicked?.x),
      },
      checked: {
        ledger: Boolean(parsed.checked?.ledger),
        fbc: Boolean(parsed.checked?.fbc),
        x: Boolean(parsed.checked?.x),
      },
    };
  } catch {
    return empty;
  }
}

export function writeSocialVerify(state: SocialVerifyState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SOCIAL_VERIFY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private mode
  }
}

/** Clear after successful signup so the next visitor on the device starts clean. */
export function clearSocialVerify(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SOCIAL_VERIFY_STORAGE_KEY);
  } catch {
    // ignore
  }
}
