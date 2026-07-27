"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

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
    <nav
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md"
      style={{
        background: "var(--nav-bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-container items-center justify-between page-pad md:h-[72px]">
        <Link
          href="/"
          className="flex items-center rounded-btn focus-visible:outline-none"
          aria-label="FutoBlockchainClub home"
        >
          <Logo size={40} priority />
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
                    ? "bg-bg-high text-ink shadow-[inset_0_-2px_0_0_var(--cyan)]"
                    : "text-ink-muted hover:text-ink hover:bg-bg-high"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <ThemeToggle className="ml-2" />
          <Link href="/ledger-contest/signup" className="btn-primary ml-2">
            Join contest
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-btn border border-theme text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t md:hidden" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col gap-1 page-pad py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-btn px-3 py-3 text-base font-medium text-ink-muted hover:bg-bg-high hover:text-ink min-h-[44px]"
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
