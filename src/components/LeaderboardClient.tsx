"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { LeaderboardEntry, LeaderboardStats } from "@/lib/types";
import { Countdown } from "./Countdown";

export function LeaderboardClient() {
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load leaderboard");
      setStats(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [load]);

  const top = stats?.entries.slice(0, 3) ?? [];
  const rest = stats?.entries.slice(3) ?? [];

  return (
    <div className="mx-auto w-full max-w-container px-margin-mobile py-12 md:px-margin-desktop md:py-16">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-electric-light">
            {"// Live registry"}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl">
            Leaderboard
          </h1>
          <p className="mt-2 max-w-xl font-body text-ink-muted">
            Ranked by verified referrals. Names are anonymized — first name + last initial only.
            Top 5 positions are prize-eligible.
          </p>
        </div>
        <Countdown compact />
      </div>

      {/* Stats strip */}
      <div className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Participants" value={stats?.total_participants ?? "—"} />
        <Stat label="Total referrals" value={stats?.total_referrals ?? "—"} />
        <Stat label="Prize slots" value="Top 5" highlight />
        <Stat label="Deadline" value="Aug 1" />
      </div>

      {loading && (
        <p className="font-mono text-sm text-ink-dim">Syncing leaderboard…</p>
      )}
      {error && (
        <p className="mb-6 border border-accent-coral/40 bg-accent-coral/10 px-4 py-3 font-mono text-xs text-accent-coral">
          {error}
        </p>
      )}

      {/* Podium top 3 */}
      {top.length > 0 && (
        <div className="mb-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
          {[top[1], top[0], top[2]].filter(Boolean).map((entry) => (
            <PodiumCard key={entry.ref_code} entry={entry} />
          ))}
        </div>
      )}

      {/* Full table */}
      <div className="border border-outline-variant bg-navy-card">
        <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3 md:px-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
            Registry cluster
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
            Auto-refresh 15s
          </span>
        </div>

        {stats && stats.entries.length === 0 && (
          <p className="px-6 py-12 text-center font-body text-ink-muted">
            No referrals yet.{" "}
            <Link href="/signup" className="text-electric-light underline">
              Be the first to join
            </Link>
            .
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="border-b border-outline-variant font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                <th className="px-4 py-3 md:px-6">Rank</th>
                <th className="px-4 py-3">Identity</th>
                <th className="px-4 py-3">Referrals</th>
                <th className="px-4 py-3 md:px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {(rest.length ? rest : stats?.entries ?? []).map((entry) => {
                // if we showed podium, list starts at 4; else show all
                const showAll = top.length === 0;
                if (!showAll && entry.rank <= 3) return null;
                return (
                  <tr
                    key={entry.ref_code}
                    className={`border-b border-outline-variant/60 font-body transition-colors hover:bg-electric/5 ${
                      entry.rank <= 5 ? "bg-electric/5" : ""
                    }`}
                  >
                    <td className="px-4 py-4 font-mono text-sm text-electric-light md:px-6">
                      #{String(entry.rank).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-4 font-display font-semibold uppercase text-white">
                      {entry.display_name}
                      {entry.rank <= 5 && (
                        <span className="ml-2 font-mono text-[9px] text-electric-light">
                          PRIZE ZONE
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm text-ink">
                      {entry.referral_count}
                    </td>
                    <td className="px-4 py-4 md:px-6">
                      <span className="border border-outline-variant px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ink-muted">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/signup"
          className="clip-button hard-shadow inline-block bg-electric px-10 py-4 font-display font-bold uppercase tracking-widest text-white hover:bg-white hover:text-electric transition-colors"
        >
          Join the contest
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border p-4 ${
        highlight
          ? "border-electric bg-electric text-white"
          : "border-outline-variant bg-navy-card"
      }`}
    >
      <p
        className={`font-mono text-[10px] uppercase tracking-widest ${
          highlight ? "text-white/70" : "text-ink-dim"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1 font-display text-2xl font-bold ${
          highlight ? "text-white" : "text-electric-light"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PodiumCard({ entry }: { entry: LeaderboardEntry }) {
  const isFirst = entry.rank === 1;
  const tier =
    entry.rank === 1 ? "Legendary" : entry.rank === 2 ? "Silver" : "Bronze";

  return (
    <div
      className={`border-2 p-6 text-center ${
        isFirst
          ? "border-electric bg-electric/15 md:order-none order-first md:-mb-4 md:scale-105"
          : "border-outline-variant bg-navy-card"
      } ${entry.rank === 2 ? "md:order-first" : ""} ${
        entry.rank === 3 ? "md:order-last" : ""
      }`}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-electric-light">
        #{entry.rank}
      </p>
      <h3 className="mt-2 font-display text-xl font-bold uppercase text-white">
        {entry.display_name}
      </h3>
      <p className="mt-2 font-mono text-sm text-ink-muted">
        {entry.referral_count} REF
      </p>
      <p className="mt-4 border-t border-outline-variant pt-3 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
        {tier} tier · Prize zone
      </p>
    </div>
  );
}
