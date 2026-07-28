import type { Metadata } from "next";
import { CommunityClient } from "./CommunityClient";

export const metadata: Metadata = {
  title: "Community",
  description: "Connect with FUTO Blockchain Club across all platforms.",
};

export default function CommunityPage() {
  return <CommunityClient />;
}