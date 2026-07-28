export const REFERRAL_STATUSES = [
  "pending",
  "verified",
  "rejected",
  "removed",
] as const;

export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

export function isReferralStatus(v: unknown): v is ReferralStatus {
  return (
    typeof v === "string" &&
    (REFERRAL_STATUSES as readonly string[]).includes(v)
  );
}

export function statusLabel(status: string | null | undefined): string {
  if (!status) return "Organic";
  switch (status) {
    case "pending":
      return "Pending";
    case "verified":
      return "Verified";
    case "rejected":
      return "Rejected";
    case "removed":
      return "Removed";
    default:
      return status;
  }
}

/** Credits that count toward leaderboard / rewards (active until rejected/removed) */
export function isCountableReferral(
  status: string | null | undefined
): boolean {
  if (!status || status === "pending" || status === "verified") return true;
  return false;
}
