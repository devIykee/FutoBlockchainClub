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
 * Core team / leadership — edit this file to update the Team page.
 * Not database-backed (fast-path; can move to CMS/DB later).
 */
export const TEAM: TeamMember[] = [
  {
    name: "Iyke",
    role: "Lead",
    x: "https://x.com",
    github: "https://github.com/devIykee",
  },
  {
    name: "Core Member",
    role: "Community",
  },
  {
    name: "Core Member",
    role: "Engineering",
  },
  {
    name: "Core Member",
    role: "Design",
  },
  {
    name: "Core Member",
    role: "Content",
  },
  {
    name: "Core Member",
    role: "Operations",
  },
];
