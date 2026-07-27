import type { Metadata } from "next";
import Link from "next/link";
import { Send, Users, AtSign, Link2, Check, ArrowRight } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { HOW_IT_WORKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Ledger Invite Contest",
  description:
    "FBC × Ledger Invite Contest — join, refer classmates, climb the leaderboard. Ends August 1.",
};

const stepIcons = {
  send: Send,
  users: Users,
  "at-sign": AtSign,
  link: Link2,
} as const;

export default function LedgerContestPage() {
  return (
    <div className="bg-ambient">
      <section className="mx-auto max-w-container page-pad py-12 md:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 label-caps">
              FBC × Ledger
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-5xl lg:text-6xl">
              Invite contest
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-ink">
              Join the Ledger community, join FBC, follow our socials, share your referral
              link, and climb the live leaderboard. Top referrers win from the prize pool.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/ledger-contest/signup" className="btn-primary text-base">
                Enter contest
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Countdown compact />
            </div>
          </div>

          <div className="card-surface p-6 md:p-8">
            <p className="label-caps">Prize pool</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink">
              Top 5 referrers win
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink">
              Rankings are live and anonymized. Exact prizes are announced through FBC
              channels. Contest closes August 1.
            </p>
            <ul className="mt-6 space-y-3 text-base text-ink">
              {[
                "Fair referral counting",
                "Public leaderboard",
                "Open to FUTO students",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-cyan"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-bg-deep/40 section-y">
        <div className="mx-auto max-w-container page-pad">
          <div className="mb-10 max-w-xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink">
              Four steps from join to climb — complete them in order on the signup form.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step) => {
              const Icon = stepIcons[step.icon];
              return (
                <div key={step.id} className="card-surface">
                  <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-white/5 text-ink-muted">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-ink">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y page-pad">
        <div className="mx-auto max-w-container rounded-panel border border-white/10 bg-bg-elevated p-8 text-center md:p-12">
          <h2 className="font-display text-3xl font-bold text-ink">Ready to compete?</h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink">
            Sign up, grab your referral link, and start climbing before the August 1
            deadline.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/ledger-contest/signup" className="btn-primary">
              Start inviting
            </Link>
            <Link href="/ledger-contest/leaderboard" className="btn-secondary">
              View leaderboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
