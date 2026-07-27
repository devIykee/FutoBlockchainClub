export type HallOfFameEntry = {
  name: string;
  achievement: string;
  /** Prize value in USD (only list $100+) */
  prizeUsd: number;
  date: string; // ISO or display-friendly, e.g. "2025-11"
  projectUrl?: string;
  description?: string;
};

/**
 * Members with bounty/hackathon wins of $100+ prize value.
 * Edit this file to add entries — not database-backed (fast-path).
 */
export const HALL_OF_FAME: HallOfFameEntry[] = [
  {
    name: "Example Builder",
    achievement: "Campus Hackathon — Best DeFi Build",
    prizeUsd: 500,
    date: "2025-11",
    description: "Placeholder entry — replace with a real FBC win.",
  },
  {
    name: "Example Builder",
    achievement: "Protocol Bounty",
    prizeUsd: 250,
    date: "2025-08",
    description: "Placeholder entry — replace with a real FBC win.",
  },
  {
    name: "Example Builder",
    achievement: "Open Source Contribution Award",
    prizeUsd: 150,
    date: "2025-05",
    description: "Placeholder entry — replace with a real FBC win.",
  },
];
