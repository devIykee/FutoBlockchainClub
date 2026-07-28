export type TeamMember = {
  name: string;
  role: string;
  /** Optional public photo URL or path under /public */
  photo?: string;
  x?: string;
  github?: string;
  linkedin?: string;
};

/**
 * @deprecated Team is managed in Supabase via /admin — not this file.
 * Kept only so old imports fail loudly if reintroduced.
 */
export const TEAM: TeamMember[] = [];
