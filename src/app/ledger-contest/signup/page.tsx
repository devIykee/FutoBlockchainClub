import type { Metadata } from "next";
import { SignUpClient } from "./SignUpClient";

export const metadata: Metadata = {
  title: "Sign up · Ledger Contest",
};

export default function ContestSignupPage() {
  return (
    <div className="bg-ambient">
      <SignUpClient />
    </div>
  );
}