"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/signup", label: "Join" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-electric bg-navy/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-container items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex h-9 w-9 items-center justify-center border-2 border-electric text-electric font-mono text-xs font-bold">
            FBC
          </span>
          <span className="font-display text-lg font-bold tracking-widest text-electric-light group-hover:text-white transition-colors uppercase">
            FBC × Ledger
          </span>
        </Link>

        <div className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? "text-electric-light border-b border-electric-light pb-0.5"
                    : "text-ink-muted hover:text-electric-light transition-colors"
                }
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/signup"
            className="clip-button bg-electric px-5 py-2.5 font-display font-bold text-white hover:bg-white hover:text-electric transition-colors"
          >
            Join Contest
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden text-electric-light font-mono text-xs uppercase tracking-widest border border-electric/50 px-3 py-2"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-t border-outline-variant md:hidden">
          <div className="flex flex-col gap-1 px-margin-mobile py-4 font-mono text-xs uppercase tracking-widest">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-ink-muted hover:text-electric-light"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="mt-2 clip-button bg-electric px-5 py-3 text-center font-display font-bold text-white"
            >
              Join Contest
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
