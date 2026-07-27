"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/hall-of-fame", label: "Hall of Fame" },
  { href: "/team", label: "Team" },
  { href: "/ledger-contest", label: "Contest" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-container items-center justify-between px-page-x py-3 md:px-page-x-md md:py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-btn bg-cyan/15 text-sm font-bold text-cyan ring-1 ring-cyan/30">
            FBC
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink group-hover:text-cyan transition-colors">
            FBC
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-btn px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-cyan/10 text-cyan"
                    : "text-ink-muted hover:text-ink hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/ledger-contest/signup" className="btn-primary ml-3">
            Join contest
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden flex h-11 w-11 items-center justify-center rounded-btn border border-white/10 text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="font-sans text-xs font-semibold uppercase tracking-wider">
            {open ? "Close" : "Menu"}
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 md:hidden">
          <div className="flex flex-col gap-1 px-page-x py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-btn px-3 py-3 text-base font-medium text-ink-muted hover:bg-white/5 hover:text-ink min-h-[44px]"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/ledger-contest/signup" className="btn-primary mt-2 w-full">
              Join contest
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
