"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUp, Radio, Trophy, Users, Link2, Calendar } from "lucide-react";
import type { LeaderboardEntry, LeaderboardStats } from "@/lib/types";
import { LEADERBOARD_POLL_MS } from "@/lib/constants";
import { Countdown } from "./Countdown";

export function LeaderboardClient() {
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  /** ref_code → previous rank for climb detection */
  const prevRanks = useRef<Map<string, number>>(new Map());
  const [climbed, setClimbed] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      const data: LeaderboardStats = await res.json();
      if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to load");

      const nextClimbed = new Set<string>();
      for (const e of data.entries || []) {
        const prev = prevRanks.current.get(e.ref_code);
        if (prev !== undefined && e.rank < prev) {
          nextClimbed.add(e.ref_code);
        }
      }
      const nextMap = new Map<string, number>();
      for (const e of data.entries || []) {
        nextMap.set(e.ref_code, e.rank);
      }
      prevRanks.current = nextMap;

      if (nextClimbed.size > 0) {
        setClimbed(nextClimbed);
        window.setTimeout(() => setClimbed(new Set()), 1400);
      }

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
    const id = setInterval(load, LEADERBOARD_POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const top = stats?.entries.slice(0, 3) ?? [];
  const rest = stats?.entries.filter((e) => e.rank > 3) ?? [];
  const allRows = stats?.entries ?? [];

  return (
    <div className="mx-auto w-full max-w-container page-pad py-12 md:py-16">
      <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-live-pulse rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            <p className="label-caps">Live leaderboard</p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            Referral rankings
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Ranked by verified referrals. Names are anonymized - first name + last initial
            only. Top 5 are prize-eligible.
          </p>
        </div>
        <Countdown compact />
      </div>

      <div className="mb-10 grid grid-cols-2 gap-3 md:mb-12 md:grid-cols-4 md:gap-4">
        <Stat
          label="Participants"
          value={stats?.total_participants ?? "-"}
          icon={<Users className="h-4 w-4" />}
        />
        <Stat
          label="Total referrals"
          value={stats?.total_referrals ?? "-"}
          icon={<Link2 className="h-4 w-4" />}
        />
        <Stat
          label="Prize slots"
          value="Top 5"
          icon={<Trophy className="h-4 w-4" />}
          highlight
        />
        <Stat
          label="Deadline"
          value="Aug 1"
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      {loading && <p className="text-sm text-ink-muted">Loading leaderboard…</p>}
      {error && <p className="mb-6 alert-danger">{error}</p>}

      {top.length > 0 && (
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
          {[top[1], top[0], top[2]].filter(Boolean).map((entry) => (
            <PodiumCard
              key={entry.ref_code}
              entry={entry}
              climbed={climbed.has(entry.ref_code)}
            />
          ))}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-card border border-white/10 md:block">
        <div className="flex items-center justify-between border-b border-white/10 bg-bg-card px-6 py-3.5">
          <h2 className="font-display text-lg font-semibold text-ink">Full rankings</h2>
          <span className="inline-flex items-center gap-1.5 label-caps">
            <Radio className="h-3 w-3 text-cyan" />
            Updates every {LEADERBOARD_POLL_MS / 1000}s
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
              <th className="px-6 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Identity</th>
              <th className="px-4 py-3 font-medium">Referrals</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((entry) => {
              const isPrize = entry.rank <= 5;
              const didClimb = climbed.has(entry.ref_code);
              return (
                <tr
                  key={entry.ref_code}
                  className={`border-b border-white/5 transition-colors ${
                    isPrize ? "bg-cyan/[0.04]" : "hover:bg-white/[0.02]"
                  } ${didClimb ? "animate-rank-up animate-rank-slide" : ""}`}
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 font-medium tabular-nums ${
                        isPrize ? "text-cyan" : "text-ink-muted"
                      }`}
                    >
                      #{String(entry.rank).padStart(2, "0")}
                      {didClimb && (
                        <ArrowUp className="h-3.5 w-3.5 text-cyan" aria-label="Rank up" />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-display font-semibold text-ink">
                    {entry.display_name}
                    {isPrize && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-cyan/25 bg-cyan/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cyan">
                        <Trophy className="h-3 w-3" />
                        Prize zone
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-medium tabular-nums text-ink">
                    {entry.referral_count}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-ink-muted">
                      Active
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Full rankings</h2>
          <span className="label-caps">{LEADERBOARD_POLL_MS / 1000}s refresh</span>
        </div>
        {allRows.map((entry) => {
          const isPrize = entry.rank <= 5;
          const didClimb = climbed.has(entry.ref_code);
          return (
            <div
              key={entry.ref_code}
              className={`card-surface p-4 ${
                isPrize ? "border-cyan/25" : ""
              } ${didClimb ? "animate-rank-up animate-rank-slide" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-1 font-medium tabular-nums ${
                    isPrize ? "text-cyan" : "text-ink-muted"
                  }`}
                >
                  #{String(entry.rank).padStart(2, "0")}
                  {didClimb && <ArrowUp className="h-3.5 w-3.5 text-cyan" />}
                </span>
                {isPrize && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan/15 px-2 py-0.5 text-xs font-medium text-cyan">
                    <Trophy className="h-3 w-3" />
                    Prize zone
                  </span>
                )}
              </div>
              <p className="mt-2 font-display text-lg font-semibold text-ink">
                {entry.display_name}
              </p>
              <p className="mt-1 text-sm text-ink-muted tabular-nums">
                {entry.referral_count} referral{entry.referral_count === 1 ? "" : "s"}
              </p>
            </div>
          );
        })}
        {stats && stats.entries.length === 0 && (
          <p className="py-8 text-center text-ink-muted">
            No referrals yet.{" "}
            <Link href="/ledger-contest/signup" className="text-cyan underline">
              Join now
            </Link>
          </p>
        )}
      </div>

      {/* rest unused but keep for clarity */}
      {rest.length === 0 && null}

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
  icon,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div
      className={`rounded-card p-4 ${
        highlight ? "bg-cyan text-cyan-deep" : "border border-white/10 bg-bg-card"
      }`}
    >
      <p
        className={`flex items-center gap-1.5 label-caps ${
          highlight ? "text-cyan-deep/70" : ""
        }`}
      >
        {icon}
        {label}
      </p>
      <p
        className={`mt-2 font-display text-2xl font-bold tabular-nums ${
          highlight ? "text-cyan-deep" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PodiumCard({
  entry,
  climbed,
}: {
  entry: LeaderboardEntry;
  climbed?: boolean;
}) {
  const isFirst = entry.rank === 1;
  const tier =
    entry.rank === 1 ? "Legendary" : entry.rank === 2 ? "Silver" : "Bronze";

  return (
    <div
      className={`rounded-card border p-6 text-center ${
        isFirst
          ? "border-cyan/40 bg-cyan/[0.08] sm:order-none order-first sm:-mb-1 sm:scale-[1.03]"
          : "border-white/10 bg-bg-card"
      } ${entry.rank === 2 ? "sm:order-first" : ""} ${
        entry.rank === 3 ? "sm:order-last" : ""
      } ${climbed ? "animate-rank-up" : ""}`}
    >
      <p className="inline-flex items-center justify-center gap-1 label-caps text-cyan">
        {isFirst && <Trophy className="h-3.5 w-3.5" />}#{entry.rank}
      </p>
      <h3 className="mt-2 font-display text-xl font-bold text-ink">
        {entry.display_name}
      </h3>
      <p className="mt-2 font-medium tabular-nums text-ink-muted">
        {entry.referral_count} ref
      </p>
      <p className="mt-4 border-t border-white/10 pt-3 label-caps">{tier} · Prize zone</p>
    </div>
  );
}
