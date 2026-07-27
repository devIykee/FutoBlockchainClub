import { LeaderboardClient } from "@/components/LeaderboardClient";

export const metadata = {
  title: "Leaderboard · FBC × Ledger Invite Contest",
};

export default function LeaderboardPage() {
  return (
    <div className="bg-grid">
      <LeaderboardClient />
    </div>
  );
}
