import type { Metadata } from "next";
import { TeamClient } from "./TeamClient";

export const metadata: Metadata = {
  title: "Team",
  description: "Core team and leadership of FUTO Blockchain Club.",
};

export default function TeamPage() {
  return <TeamClient />;
}