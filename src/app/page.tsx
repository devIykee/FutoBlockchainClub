import Link from "next/link";
import { CLUB_HIGHLIGHTS } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="bg-ambient">
      {/* Hero — club identity */}
      <section className="mx-auto max-w-container px-page-x pb-16 pt-14 md:px-page-x-md md:pb-24 md:pt-20">
        <div className="max-w-3xl">
          <p className="label-caps text-cyan">FUTO Blockchain Club</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-6xl">
            Build on-chain culture at FUTO
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
            FBC is the home for students exploring blockchain, Web3, and decentralized
            tech — through workshops, bounties, community, and real projects.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/team" className="btn-primary">
              Meet the team
            </Link>
            <Link href="/hall-of-fame" className="btn-secondary">
              Hall of Fame
            </Link>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="border-t border-white/5 bg-bg-deep/50 py-16 md:py-20">
        <div className="mx-auto max-w-container px-page-x md:px-page-x-md">
          <div className="mb-10 max-w-xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              What we do
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink">
              From first wallet setup to shipping in public — FBC is built for students
              who want to learn by doing.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CLUB_HIGHLIGHTS.map((item) => (
              <div key={item.title} className="card-surface p-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contest teaser — present but not dominant */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-container px-page-x md:px-page-x-md">
          <div className="card-surface relative overflow-hidden p-8 md:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan/10 blur-2xl" />
            <p className="label-caps text-cyan">Campaign</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">
              Ledger Invite Contest
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink">
              A time-boxed referral contest with FBC × Ledger. Join the community, share
              your link, and climb the leaderboard before August 1.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/ledger-contest" className="btn-primary">
                View contest
              </Link>
              <Link href="/ledger-contest/leaderboard" className="btn-secondary">
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="border-t border-white/5 py-16 md:py-20">
        <div className="mx-auto grid max-w-container grid-cols-1 gap-4 px-page-x sm:grid-cols-2 md:px-page-x-md">
          <Link
            href="/hall-of-fame"
            className="card-surface group p-8 transition-shadow hover:shadow-glow"
          >
            <p className="label-caps text-cyan">Wins</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink group-hover:text-cyan transition-colors">
              Hall of Fame
            </h3>
            <p className="mt-3 text-base leading-relaxed text-ink">
              Members who have won bounties and hackathons at $100+ prize value.
            </p>
          </Link>
          <Link
            href="/team"
            className="card-surface group p-8 transition-shadow hover:shadow-glow"
          >
            <p className="label-caps text-cyan">People</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink group-hover:text-cyan transition-colors">
              Core team
            </h3>
            <p className="mt-3 text-base leading-relaxed text-ink">
              Leadership and core organizers keeping FBC running.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
