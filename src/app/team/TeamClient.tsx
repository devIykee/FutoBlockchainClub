"use client";

import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { X, Link2 } from "lucide-react";
import Link from "next/link";
import type { TeamMemberRow } from "@/lib/types";

export function TeamClient() {
  const [members, setMembers] = useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((d) => setMembers(d.members || []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

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
              People
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Core Team
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              Meet the passionate individuals leading FUTO Blockchain Club and driving our mission forward.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    custom={i}
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden"
                  >
                    <Skeleton className="w-full h-64 bg-gray-200 dark:bg-gray-800" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800" />
                    </div>
                  </motion.div>
                ))
              : members.map((member, i) => (
                  <motion.div
                    key={member.id}
                    variants={fadeInUp}
                    custom={i}
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      {member.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.photo}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                          {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{member.role}</p>
                      <div className="flex gap-3">
                        {member.x && (
                          <a
                            href={member.x}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </a>
                        )}
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Link2 className="w-5 h-5" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Link2 className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* Hall of Fame Teaser */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-t border-blue-200 dark:border-blue-800">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hall of Fame</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Recognize outstanding contributors and past leaders of FBC
              </p>
            </div>
            <Link href="/hall-of-fame">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                View Hall of Fame
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}