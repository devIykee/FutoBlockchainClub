"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

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
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-container items-center justify-between page-pad md:h-[72px]">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-btn focus-visible:outline-none"
          aria-label="FutoBlockchainClub home"
        >
          <Logo size={36} priority />
          <span className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
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
                    ? "bg-white/5 text-ink"
                    : "text-ink-muted hover:text-ink hover:bg-white/5"
                } ${active ? "shadow-[inset_0_-2px_0_0_#00E5FF]" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/ledger-contest/signup" className="btn-primary ml-4">
            Join contest
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden flex h-11 w-11 items-center justify-center rounded-btn border border-white/10 text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 md:hidden">
          <div className="flex flex-col gap-1 page-pad py-4">
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
