/** Contest ends end-of-day Aug 1 (WAT). */
export const CONTEST_END = new Date("2026-08-01T23:59:59+01:00");

export const REF_STORAGE_KEY = "fbc_ref";
export const REF_COOKIE_NAME = "fbc_ref";
export const ADMIN_COOKIE_NAME = "fbc_admin_session";
/** Persists signup social click + checkbox state across refresh */
export const SOCIAL_VERIFY_STORAGE_KEY = "fbc_social_verify";

/** Leaderboard poll interval — free-tier friendly. */
export const LEADERBOARD_POLL_MS = 45_000;

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

/** Contest steps — sequential, icons not numbered decoration. */
export const HOW_IT_WORKS = [
  {
    id: "ledger",
    title: "Join Ledger TG",
    body: "Join the Ledger Next community on Telegram — the first gate of the contest.",
    icon: "send" as const,
  },
  {
    id: "fbc",
    title: "Join FBC",
    body: "Plug into FUTO Blockchain Club and meet the builders on campus.",
    icon: "users" as const,
  },
  {
    id: "socials",
    title: "Follow socials",
    body: "Follow FBC on X so you never miss announcements and contest updates.",
    icon: "at-sign" as const,
  },
  {
    id: "share",
    title: "Share & climb",
    body: "Grab your unique referral link, invite classmates, and climb the live leaderboard.",
    icon: "link" as const,
  },
] as const;

export const CLUB_HIGHLIGHTS = [
  {
    title: "Events & Workshops",
    body: "Talks, build nights, and hands-on sessions covering wallets, smart contracts, DeFi, and more.",
    icon: "calendar" as const,
  },
  {
    title: "Bounties & Hackathons",
    body: "Ship projects, compete for prizes, and put your skills on the board with real stakes.",
    icon: "trophy" as const,
  },
  {
    title: "Community",
    body: "A home for FUTO students exploring Web3 — from first-timers to advanced builders.",
    icon: "users" as const,
  },
  {
    title: "Education",
    body: "Structured learning paths and peer support so no one ships alone.",
    icon: "book-open" as const,
  },
] as const;
