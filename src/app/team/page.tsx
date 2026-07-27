import type { Metadata } from "next";
import { TEAM } from "@/content/team";

export const metadata: Metadata = {
  title: "Team",
  description: "Core team and leadership of FUTO Blockchain Club.",
};

export default function TeamPage() {
  return (
    <div className="bg-ambient mx-auto max-w-container px-page-x py-12 md:px-page-x-md md:py-16">
      <div className="max-w-2xl">
        <p className="label-caps text-cyan">People</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Core team
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink">
          The organizers and core members who keep FBC running — events, community,
          and campaigns.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((member) => (
          <article key={`${member.name}-${member.role}`} className="card-surface p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan/15 text-lg font-bold text-cyan ring-1 ring-cyan/25">
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials(member.name)
              )}
            </div>
            <h2 className="mt-4 font-display text-xl font-bold text-ink">
              {member.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-cyan">{member.role}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink-muted">
              {member.x && (
                <a
                  href={member.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan transition-colors"
                >
                  X
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan transition-colors"
                >
                  GitHub
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan transition-colors"
                >
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
