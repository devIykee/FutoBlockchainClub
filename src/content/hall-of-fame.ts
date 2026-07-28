export type HallOfFameEntry = {
  name: string;
  achievement: string;
  /** Prize value in USD (only list $100+) */
  prizeUsd: number;
  date: string;
  projectUrl?: string;
  description?: string;
};

/**
 * @deprecated Hall of Fame is managed in Supabase via /admin — not this file.
 * Kept only so old imports fail loudly if reintroduced.
 */
export const HALL_OF_FAME: HallOfFameEntry[] = [];
