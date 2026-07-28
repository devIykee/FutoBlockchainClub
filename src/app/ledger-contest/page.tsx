import type { Metadata } from "next";
import { ContestLandingClient } from "./ContestLandingClient";

export const metadata: Metadata = {
  title: "Ledger Invite Contest",
  description:
    "FBC x Ledger Invite Contest - join, refer classmates, climb the leaderboard. Ends August 1.",
};

export default function LedgerContestPage() {
  return <ContestLandingClient />;
}