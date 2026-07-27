import { SignupForm } from "@/components/SignupForm";

export const metadata = {
  title: "Sign up · FBC × Ledger Invite Contest",
};

export default function SignupPage() {
  return (
    <div className="bg-grid px-margin-mobile py-12 md:px-margin-desktop md:py-16">
      <SignupForm />
    </div>
  );
}
