export type Signup = {
  id: string;
  full_name: string;
  department: string;
  level: string;
  niche: string;
  skill_level: string;
  x_handle: string;
  telegram_username: string;
  ref_code: string;
  referred_by: string | null;
  joined_ledger: boolean;
  joined_fbc: boolean;
  followed_x: boolean;
  created_at: string;
};

export type LeaderboardEntry = {
  rank: number;
  display_name: string;
  referral_count: number;
  ref_code: string;
};

export type LeaderboardStats = {
  total_participants: number;
  total_referrals: number;
  entries: LeaderboardEntry[];
};
