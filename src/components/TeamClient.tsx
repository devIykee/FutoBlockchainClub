"use client";

import { useEffect, useState } from "react";
import { Link2, X } from "lucide-react";
import type { TeamMemberRow } from "@/lib/types";

export function TeamClient() {
  const [members, setMembers] = useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMembers(d.members || []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-ambient mx-auto max-w-container page-pad py-12 md:py-16">
      <div className="max-w-2xl">
        <p className="label-caps">People</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Core team
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink">
          The organizers and core members who keep FBC running — events, community, and
          campaigns.
        </p>
      </div>

      {loading && (
        <p className="mt-10 text-sm text-ink-muted">Loading team…</p>
      )}

      {!loading && members.length === 0 && (
        <p className="mt-12 text-ink-muted">
          Team roster will appear here once published by admins.
        </p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <article key={member.id} className="card-surface">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-bg-high text-sm font-bold text-ink ring-1 ring-theme">
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                initials(member.name)
              )}
            </div>
            <h2 className="mt-4 font-display text-xl font-bold text-ink">
              {member.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-ink-muted">{member.role}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink-muted">
              {member.x && (
                <a
                  href={member.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-ink transition-colors"
                >
                  <X className="h-4 w-4" />
                  X
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-ink transition-colors"
                >
                  <Link2 className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-ink transition-colors"
                >
                  <Link2 className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
