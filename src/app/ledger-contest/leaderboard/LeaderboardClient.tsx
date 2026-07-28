"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { RefreshCw } from 'lucide-react';
import type { LeaderboardStats } from "@/lib/types";
import { LEADERBOARD_POLL_MS, CONTEST_END } from "@/lib/constants";

export function LeaderboardClient() {
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(0);
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
      setLastUpdated(0);
    } catch {
      // Silently fail for leaderboard; keep previous data.
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    load();
    const id = setInterval(load, LEADERBOARD_POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setLastUpdated((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading]);

  const handleRefresh = () => {
    setLoading(true);
    load();
  };

  const deadline = CONTEST_END;
  const allRows = stats?.entries ?? [];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800';
      case 'winner':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800';
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-4">
              Contest
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Live Leaderboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              See where you stand in the Ledger referral contest. The leaderboard updates every 45 seconds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-12 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-widest font-semibold mb-8 text-center">
              Contest Ends In
            </p>
            <CountdownTimer deadline={deadline} />
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: 'Participants', value: stats?.total_participants?.toLocaleString() ?? '-' },
              { label: 'Total Referrals', value: stats?.total_referrals?.toLocaleString() ?? '-' },
              { label: 'Prize Slots', value: '10' },
              { label: 'Days Left', value: Math.max(0, Math.floor((CONTEST_END.getTime() - Date.now()) / (1000 * 60 * 60 * 24))).toString() },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                className="text-center"
              >
                <p className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-widest font-semibold mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Leaderboard Table */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rankings</h2>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Last Updated Indicator */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Last updated {lastUpdated} seconds ago
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Rank</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Name</th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-900 dark:text-white">Referrals</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-4 px-4">
                          <Skeleton className="h-6 w-8 bg-gray-200 dark:bg-gray-800" />
                        </td>
                        <td className="py-4 px-4">
                          <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-gray-800" />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Skeleton className="h-6 w-12 ml-auto bg-gray-200 dark:bg-gray-800" />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Skeleton className="h-6 w-16 mx-auto bg-gray-200 dark:bg-gray-800" />
                        </td>
                      </tr>
                    ))
                  : allRows.map((entry, i) => {
                      const isPrize = entry.rank <= 5;
                      const didClimb = climbed.has(entry.ref_code);
                      return (
                        <motion.tr
                          key={entry.ref_code}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                            entry.rank <= 3 ? 'bg-blue-50 dark:bg-blue-950' : ''
                          } ${didClimb ? 'animate-rank-up animate-rank-slide' : ''}`}
                        >
                          <td className="py-4 px-4">
                            <span className="text-2xl font-bold">
                              {getRankBadge(entry.rank)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900 dark:text-white">{entry.display_name}</span>
                            {isPrize && (
                              <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-cyan/25 bg-cyan/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cyan">
                                Prize zone
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="font-mono font-semibold text-gray-900 dark:text-white">
                              {entry.referral_count}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                isPrize ? 'eligible' : 'pending'
                              )}`}
                            >
                              {isPrize ? '✓ Eligible' : 'Active'}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
              </tbody>
            </table>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Not on the leaderboard yet? Join the contest and start climbing!
            </p>
            <Link href="/ledger-contest/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Join Contest
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}