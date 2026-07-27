import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Trophy,
  Users,
  ArrowRight,
  Link2,
} from "lucide-react";
import { CLUB_HIGHLIGHTS } from "@/lib/constants";

const highlightIcons = {
  calendar: Calendar,
  trophy: Trophy,
  users: Users,
  "book-open": BookOpen,
} as const;

export default function HomePage() {
  return (
    <div className="bg-ambient">
      <section className="mx-auto max-w-container page-pad pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="max-w-3xl">
          <p className="label-caps">FUTO Blockchain Club</p>
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

      <section className="border-t border-white/5 bg-bg-deep/50 section-y">
        <div className="mx-auto max-w-container page-pad">
          <div className="mb-8 max-w-xl md:mb-10">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              What we do
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink">
              From first wallet setup to shipping in public — FBC is built for students
              who want to learn by doing.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CLUB_HIGHLIGHTS.map((item) => {
              const Icon = highlightIcons[item.icon];
              return (
                <div key={item.title} className="card-surface">
                  <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-white/5 text-ink-muted">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-ink">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contest teaser — present, not dominant; cyan only on action */}
      <section className="section-y">
        <div className="mx-auto max-w-container page-pad">
          <div className="card-surface flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-xl">
              <p className="label-caps">Campaign</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">
                Ledger Invite Contest
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink">
                A time-boxed referral contest with FBC × Ledger. Join the community, share
                your link, and climb the leaderboard before August 1.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link href="/ledger-contest" className="btn-primary">
                View contest
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/ledger-contest/leaderboard" className="btn-secondary">
                <Link2 className="h-4 w-4" />
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 section-y">
        <div className="mx-auto grid max-w-container grid-cols-1 gap-4 page-pad sm:grid-cols-2">
          <Link
            href="/hall-of-fame"
            className="card-surface group transition-colors hover:border-gold/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-gold-soft text-gold">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-ink">
              Hall of Fame
            </h3>
            <p className="mt-2 text-base leading-relaxed text-ink">
              Members who have won bounties and hackathons at $100+ prize value.
            </p>
          </Link>
          <Link
            href="/team"
            className="card-surface group transition-colors hover:border-white/20"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-white/5 text-ink-muted">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-ink">Core team</h3>
            <p className="mt-2 text-base leading-relaxed text-ink">
              Leadership and core organizers keeping FBC running.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
