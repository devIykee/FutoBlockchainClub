import type { Metadata } from "next";
import { SignupForm } from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign up · Ledger Contest",
};

export default function ContestSignupPage() {
  return (
    <div className="bg-ambient px-page-x py-10 md:px-page-x-md md:py-14">
      <SignupForm />
    </div>
  );
}
