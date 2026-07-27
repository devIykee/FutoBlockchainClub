import type { Metadata } from "next";
import { Link2, X } from "lucide-react";
import { TEAM } from "@/content/team";

export const metadata: Metadata = {
  title: "Team",
  description: "Core team and leadership of FUTO Blockchain Club.",
};

export default function TeamPage() {
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

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((member) => (
          <article key={`${member.name}-${member.role}`} className="card-surface">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/5 text-sm font-bold text-ink ring-1 ring-white/10">
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.photo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                initials(member.name)
              )}
            </div>
            <h2 className="mt-4 font-display text-xl font-bold text-ink">{member.name}</h2>
            <p className="mt-1 text-sm font-medium text-ink-muted">{member.role}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink-muted">
              {member.x && (
                <a
                  href={member.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-ink transition-colors"
                  aria-label={`${member.name} on X`}
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


