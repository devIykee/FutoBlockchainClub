"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Trophy } from "lucide-react";
import type { HallOfFameRow } from "@/lib/types";

export function HallOfFameClient() {
  const [entries, setEntries] = useState<HallOfFameRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hall-of-fame")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

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

      {loading && <p className="mt-10 text-sm text-ink-muted">Loading…</p>}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <article
            key={entry.id}
            className={`card-surface ${
              i === 0 ? "border-gold/35 shadow-glow-gold sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-gold-soft text-gold">
                <Trophy className="h-4 w-4" aria-hidden />
              </div>
              <span className="rounded-full border border-gold/30 bg-gold-soft px-2.5 py-0.5 text-xs font-semibold tabular-nums text-gold">
                ${Number(entry.prize_usd).toLocaleString()}
              </span>
            </div>
            <p className="mt-4 label-caps">{entry.date}</p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">{entry.name}</h2>
            <p className="mt-1 font-medium text-ink-muted">{entry.achievement}</p>
            {entry.description && (
              <p className="mt-3 text-base leading-relaxed text-ink">{entry.description}</p>
            )}
            {entry.project_url && (
              <a
                href={entry.project_url}
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

      {!loading && entries.length === 0 && (
        <p className="mt-12 text-ink-muted">No entries yet - check back soon.</p>
      )}
    </div>
  );
}
