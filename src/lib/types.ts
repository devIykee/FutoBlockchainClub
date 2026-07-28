export type ReferralStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "removed"
  | null;

export type Signup = {
  id: string;
  full_name: string;
  department: string;
  level: string;
  niche: string;
  skill_level: string;
  phone: string;
  x_handle: string;
  telegram_username: string;
  ref_code: string;
  referred_by: string | null;
  previous_referred_by?: string | null;
  referral_status?: ReferralStatus;
  referral_source?: string | null;
  referral_reviewed_at?: string | null;
  referral_reviewed_by?: string | null;
  referral_review_reason?: string | null;
  joined_ledger: boolean;
  joined_fbc: boolean;
  followed_x: boolean;
  created_at: string;
};

export type AdminAuditEntry = {
  id: string;
  admin_actor: string;
  action: string;
  target_signup_id: string | null;
  target_ref_code: string | null;
  referrer_ref_code: string | null;
  reason: string;
  metadata?: Record<string, unknown> | null;
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

export type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  x: string | null;
  github: string | null;
  linkedin: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type HallOfFameRow = {
  id: string;
  name: string;
  achievement: string;
  prize_usd: number;
  date: string;
  project_url: string | null;
  description: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};
