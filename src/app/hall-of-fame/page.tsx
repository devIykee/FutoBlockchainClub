import type { Metadata } from "next";
import { Trophy, ExternalLink } from "lucide-react";
import { HALL_OF_FAME } from "@/content/hall-of-fame";

export const metadata: Metadata = {
  title: "Hall of Fame",
  description: "FBC members with bounty and hackathon wins of $100+.",
};

export default function HallOfFamePage() {
  const sorted = [...HALL_OF_FAME].sort((a, b) => b.prizeUsd - a.prizeUsd);

  return (
    <div className="bg-ambient mx-auto max-w-container page-pad py-12 md:py-16">
      <div className="max-w-2xl">
        <p className="label-caps">Achievements</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Hall of Fame
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink">
          Members who have won bounties or hackathons with prize value of $100 or more.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((entry, i) => (
          <article
            key={`${entry.name}-${entry.achievement}-${entry.date}`}
            className={`card-surface ${
              i === 0 ? "border-gold/35 shadow-glow-gold sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-gold-soft text-gold">
                <Trophy className="h-4 w-4" aria-hidden />
              </div>
              <span className="rounded-full border border-gold/30 bg-gold-soft px-2.5 py-0.5 text-xs font-semibold tabular-nums text-gold">
                ${entry.prizeUsd.toLocaleString()}
              </span>
            </div>
            <p className="mt-4 label-caps">{entry.date}</p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">{entry.name}</h2>
            <p className="mt-1 font-medium text-ink-muted">{entry.achievement}</p>
            {entry.description && (
              <p className="mt-3 text-base leading-relaxed text-ink">{entry.description}</p>
            )}
            {entry.projectUrl && (
              <a
                href={entry.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-cyan transition-colors"
              >
                View project
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </article>
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="mt-12 text-ink-muted">No entries yet — check back soon.</p>
      )}
    </div>
  );
}
