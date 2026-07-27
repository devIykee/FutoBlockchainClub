import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { HOW_IT_WORKS } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="bg-grid">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-container grid-cols-1 items-center gap-12 px-margin-mobile py-16 md:grid-cols-2 md:px-margin-desktop md:py-24">
          <div className="space-y-8">
            <div className="inline-block border border-electric px-4 py-1 font-mono text-xs uppercase tracking-widest text-electric-light">
              {"// Season 01 · FUTO Blockchain Club"}
            </div>
            <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-electric-light md:text-6xl lg:text-7xl">
              Secure your
              <br />
              <span className="text-white">on-chain</span>
              <br />
              legacy
            </h1>
            <p className="max-w-lg font-body text-lg text-ink-muted">
              The FBC × Ledger Invite Contest is live. Join the Ledger community, join FBC,
              follow our socials, share your referral link, and climb the leaderboard for
              prizes.
            </p>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="clip-button hard-shadow glitch-hover inline-block bg-electric px-8 py-4 text-center font-display text-lg font-bold uppercase tracking-wide text-white hover:bg-white hover:text-electric transition-colors"
              >
                Enter contest
              </Link>
              <Countdown compact />
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute -inset-3 border-2 border-electric/20 diagonal-divider -z-10" />
            <div className="clip-diagonal hard-shadow border-2 border-electric bg-navy-high p-6">
              <div className="flex aspect-[4/3] items-center justify-center border border-outline-variant bg-gradient-to-br from-electric/30 via-navy-deep to-navy-highest">
                <div className="text-center px-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-electric-light">
                    Asset vault
                  </p>
                  <p className="mt-4 font-display text-3xl font-bold uppercase text-white">
                    FBC × Ledger
                  </p>
                  <p className="mt-2 font-mono text-xs text-ink-dim">
                    Invite contest · FUTO
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold uppercase text-electric-light">
                    Prize pool live
                  </h3>
                  <p className="font-mono text-xs text-ink-dim">Contest ends August 1</p>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-electric-light">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prize callout */}
      <section className="bg-navy-deep py-20">
        <div className="mx-auto max-w-container px-margin-mobile md:px-margin-desktop">
          <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-electric-light md:text-4xl">
              The reward pool
            </h2>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-dim">
              {"// Top referrers win"}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="clip-diagonal bg-electric p-8 text-white md:col-span-1">
              <p className="font-mono text-xs font-bold uppercase tracking-widest">
                Rank #01 – #05
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold uppercase">
                Prize winners
              </h3>
              <p className="mt-3 font-body text-white/90">
                Top 5 on the live leaderboard at contest close take the prize pool.
                Exact prizes announced via FBC channels.
              </p>
            </div>
            <div className="border-2 border-electric bg-navy-high p-8 md:col-span-1">
              <p className="font-mono text-xs uppercase tracking-widest text-electric-light">
                Fair play
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase text-white">
                Referral ranked
              </h3>
              <p className="mt-3 font-body text-ink-muted">
                Only signups that complete the form and social checks count toward your
                score.
              </p>
            </div>
            <div className="border border-outline-variant bg-navy-card p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-dim">
                Deadline
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase text-white">
                August 1
              </h3>
              <p className="mt-3 font-body text-ink-muted">
                Share early. Rankings update live as referrals convert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10 diagonal-divider bg-electric/5" />
        <div className="mx-auto max-w-container px-margin-mobile md:px-margin-desktop">
          <div className="mb-16 text-center">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-electric-light md:text-4xl">
              Mission parameters
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-electric" />
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative group">
                <div className="step-number font-display absolute -top-10 left-0 text-7xl opacity-30 select-none">
                  {step.step}
                </div>
                <div className="relative pt-8">
                  <h3 className="font-display text-xl font-semibold uppercase text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 font-body text-ink-muted">{step.body}</p>
                  <div className="mt-6 h-1 w-full overflow-hidden bg-navy-highest">
                    <div className="h-full w-1/4 bg-electric transition-all duration-700 group-hover:w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-margin-mobile py-20 md:px-margin-desktop">
        <div className="clip-diagonal relative mx-auto max-w-container overflow-hidden border-4 border-electric bg-navy-high p-10 text-center md:p-14">
          <h2 className="font-display text-3xl font-bold uppercase text-white md:text-4xl">
            Ready for deployment?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-ink-muted">
            Sign up, grab your referral link, and start climbing. Contest closes August 1.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row">
            <Link
              href="/signup"
              className="clip-button bg-electric px-10 py-4 font-display font-bold uppercase tracking-widest text-white hover:bg-white hover:text-electric transition-colors"
            >
              Start inviting
            </Link>
            <Link
              href="/leaderboard"
              className="clip-button border border-electric px-10 py-4 font-display font-bold uppercase tracking-widest text-electric-light hover:bg-electric/10 transition-colors"
            >
              View leaderboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
