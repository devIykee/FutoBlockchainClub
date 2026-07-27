import { ThankYouClient } from "@/components/ThankYouClient";
import Link from "next/link";

export const metadata = {
  title: "You're in · FBC × Ledger Invite Contest",
};

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const refCode = searchParams.ref?.trim();

  if (!refCode) {
    return (
      <div className="mx-auto max-w-lg px-margin-mobile py-20 text-center">
        <h1 className="font-display text-3xl font-bold uppercase text-white">
          Missing referral code
        </h1>
        <p className="mt-3 font-body text-ink-muted">
          Complete signup first to get your personal link.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block bg-electric px-8 py-3 font-display font-bold uppercase text-white"
        >
          Go to signup
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-grid">
      <ThankYouClient refCode={refCode} />
    </div>
  );
}
