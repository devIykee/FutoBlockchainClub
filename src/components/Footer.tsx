import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/socials";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-white/10 bg-bg-deep">
      <div className="mx-auto flex w-full max-w-container flex-col gap-10 page-pad py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-4">
          <div className="flex items-center gap-3 opacity-90">
            <Logo size={32} />
            <span className="font-display text-lg font-semibold text-ink">FBC</span>
          </div>
          <p className="text-base leading-relaxed text-ink">
            FUTO Blockchain Club — building community, skills, and on-chain culture at the
            Federal University of Technology, Owerri.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
          <div>
            <p className="label-caps mb-3">Explore</p>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li>
                <Link href="/" className="hover:text-ink transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/hall-of-fame" className="hover:text-ink transition-colors">
                  Hall of Fame
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-ink transition-colors">
                  Team
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="label-caps mb-3">Campaigns</p>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li>
                <Link href="/ledger-contest" className="hover:text-ink transition-colors">
                  Ledger Contest
                </Link>
              </li>
              <li>
                <Link
                  href="/ledger-contest/leaderboard"
                  className="hover:text-ink transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/ledger-contest/signup"
                  className="hover:text-ink transition-colors"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="label-caps mb-3">Socials</p>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li>
                <a
                  href={SOCIAL_LINKS.fbcX}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors"
                >
                  X / Twitter
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.fbcTelegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.fbcWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 page-pad py-4">
        <p className="mx-auto max-w-container text-center text-xs text-ink-dim md:text-left">
          © {year} FutoBlockchainClub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
