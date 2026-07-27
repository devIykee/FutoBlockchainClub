import type { Metadata } from "next";
import Link from "next/link";
import { ThankYouClient } from "@/components/ThankYouClient";

export const metadata: Metadata = {
  title: "You're in · Ledger Contest",
};

export default function ContestThankYouPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const refCode = searchParams.ref?.trim();

  if (!refCode) {
    return (
      <div className="mx-auto max-w-lg px-page-x py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">
          Missing referral code
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink">
          Complete signup first to get your personal link.
        </p>
        <Link href="/ledger-contest/signup" className="btn-primary mt-8 inline-flex">
          Go to signup
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ambient">
      <ThankYouClient refCode={refCode} />
    </div>
  );
}
