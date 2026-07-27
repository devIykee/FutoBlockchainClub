import type { Metadata } from "next";
import { LeaderboardClient } from "@/components/LeaderboardClient";

export const metadata: Metadata = {
  title: "Leaderboard · Ledger Contest",
};

export default function ContestLeaderboardPage() {
  return (
    <div className="bg-ambient">
      <LeaderboardClient />
    </div>
  );
}
