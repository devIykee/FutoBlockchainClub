/** Contest ends end-of-day Aug 1 (local interpretation: UTC midnight next day). */
export const CONTEST_END = new Date("2026-08-01T23:59:59+01:00");

export const REF_STORAGE_KEY = "fbc_ref";
export const REF_COOKIE_NAME = "fbc_ref";
export const ADMIN_COOKIE_NAME = "fbc_admin_session";

export const LEVELS = ["100", "200", "300", "400", "500", "Postgrad"] as const;

export const NICHES = [
  "Development",
  "Design",
  "Content & Marketing",
  "Community & Growth",
  "Research",
  "Trading/DeFi",
  "Other",
] as const;

export const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export type Level = (typeof LEVELS)[number];
export type Niche = (typeof NICHES)[number];
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Join Ledger TG",
    body: "Join the Ledger Next community on Telegram — the first gate of the contest.",
  },
  {
    step: "02",
    title: "Join FBC",
    body: "Plug into FUTO Blockchain Club and meet the squad building on-chain at FUTO.",
  },
  {
    step: "03",
    title: "Follow Socials",
    body: "Follow FBC on X so you never miss announcements, drops, and contest updates.",
  },
  {
    step: "04",
    title: "Share & Climb",
    body: "Grab your unique referral link, invite classmates, and climb the live leaderboard.",
  },
] as const;
