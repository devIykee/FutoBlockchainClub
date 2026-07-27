import type { Metadata } from "next";
import { HallOfFameClient } from "@/components/HallOfFameClient";

export const metadata: Metadata = {
  title: "Hall of Fame",
  description: "FBC members with bounty and hackathon wins of $100+.",
};

export default function HallOfFamePage() {
  return <HallOfFameClient />;
}
