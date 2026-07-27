"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { LeaderboardEntry, LeaderboardStats } from "@/lib/types";
import { LEADERBOARD_POLL_MS } from "@/lib/constants";
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
    // Single poll loop per page — free-tier friendly (30–60s range)
    const id = setInterval(load, LEADERBOARD_POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const top = stats?.entries.slice(0, 3) ?? [];
  const rest = stats?.entries.filter((e) => e.rank > 3) ?? [];
  const tableRows = top.length ? rest : stats?.entries ?? [];

  return (
    <div className="mx-auto w-full max-w-container px-page-x py-10 md:px-page-x-md md:py-14">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label-caps text-cyan">Live leaderboard</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            Referral rankings
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink">
            Ranked by verified referrals. Names are anonymized — first name + last
            initial only. Top 5 are prize-eligible.
          </p>
        </div>
        <Countdown compact />
      </div>

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Participants" value={stats?.total_participants ?? "—"} />
        <Stat label="Total referrals" value={stats?.total_referrals ?? "—"} />
        <Stat label="Prize slots" value="Top 5" highlight />
        <Stat label="Deadline" value="Aug 1" />
      </div>

      {loading && <p className="text-sm text-ink-muted">Loading leaderboard…</p>}
      {error && (
        <p className="mb-6 rounded-btn border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {top.length > 0 && (
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
          {[top[1], top[0], top[2]].filter(Boolean).map((entry) => (
            <PodiumCard key={entry.ref_code} entry={entry} />
          ))}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-card border border-white/10 md:block">
        <div className="flex items-center justify-between border-b border-white/10 bg-bg-card px-6 py-3">
          <h2 className="font-display text-lg font-semibold text-ink">Full rankings</h2>
          <span className="label-caps">
            Auto-refresh {LEADERBOARD_POLL_MS / 1000}s
          </span>
        </div>
        {stats && stats.entries.length === 0 && (
          <p className="px-6 py-12 text-center text-ink-muted">
            No referrals yet.{" "}
            <Link href="/ledger-contest/signup" className="text-cyan underline">
              Be the first to join
            </Link>
            .
          </p>
        )}
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 label-caps">
              <th className="px-6 py-3">Rank</th>
              <th className="px-4 py-3">Identity</th>
              <th className="px-4 py-3">Referrals</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(top.length ? [...top, ...rest] : tableRows).map((entry) => (
              <tr
                key={entry.ref_code}
                className={`border-b border-white/5 transition-colors hover:bg-cyan/5 ${
                  entry.rank <= 5 ? "bg-cyan/5" : ""
                }`}
              >
                <td className="px-6 py-4 font-medium text-cyan">
                  #{String(entry.rank).padStart(2, "0")}
                </td>
                <td className="px-4 py-4 font-display font-semibold text-ink">
                  {entry.display_name}
                  {entry.rank <= 5 && (
                    <span className="ml-2 label-caps text-cyan">Prize zone</span>
                  )}
                </td>
                <td className="px-4 py-4 font-medium text-ink">
                  {entry.referral_count}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-ink-muted">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="space-y-3 md:hidden">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Full rankings</h2>
          <span className="label-caps">
            {LEADERBOARD_POLL_MS / 1000}s refresh
          </span>
        </div>
        {(stats?.entries ?? []).map((entry) => (
          <div
            key={entry.ref_code}
            className={`card-surface p-4 ${entry.rank <= 5 ? "shadow-glow border-cyan/20" : ""}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-cyan">
                #{String(entry.rank).padStart(2, "0")}
              </span>
              {entry.rank <= 5 && (
                <span className="rounded-full bg-cyan/15 px-2 py-0.5 text-xs font-medium text-cyan">
                  Prize zone
                </span>
              )}
            </div>
            <p className="mt-2 font-display text-lg font-semibold text-ink">
              {entry.display_name}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {entry.referral_count} referral{entry.referral_count === 1 ? "" : "s"}
            </p>
          </div>
        ))}
        {stats && stats.entries.length === 0 && (
          <p className="py-8 text-center text-ink-muted">
            No referrals yet.{" "}
            <Link href="/ledger-contest/signup" className="text-cyan underline">
              Join now
            </Link>
          </p>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link href="/ledger-contest/signup" className="btn-primary">
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
      className={`rounded-card p-4 ${
        highlight
          ? "bg-cyan text-cyan-deep"
          : "border border-white/10 bg-bg-card"
      }`}
    >
      <p className={`label-caps ${highlight ? "text-cyan-deep/70" : ""}`}>
        {label}
      </p>
      <p
        className={`mt-1 font-display text-2xl font-bold ${
          highlight ? "text-cyan-deep" : "text-cyan"
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
      className={`rounded-card border p-6 text-center ${
        isFirst
          ? "border-cyan/40 bg-cyan/10 shadow-glow sm:order-none order-first sm:-mb-2 sm:scale-105"
          : "border-white/10 bg-bg-card"
      } ${entry.rank === 2 ? "sm:order-first" : ""} ${
        entry.rank === 3 ? "sm:order-last" : ""
      }`}
    >
      <p className="label-caps text-cyan">#{entry.rank}</p>
      <h3 className="mt-2 font-display text-xl font-bold text-ink">
        {entry.display_name}
      </h3>
      <p className="mt-2 font-medium text-ink-muted">
        {entry.referral_count} ref
      </p>
      <p className="mt-4 border-t border-white/10 pt-3 label-caps">
        {tier} · Prize zone
      </p>
    </div>
  );
}
