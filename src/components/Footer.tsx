import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  const x = process.env.NEXT_PUBLIC_FBC_X_LINK || "https://x.com";
  const tg = process.env.NEXT_PUBLIC_FBC_TG_LINK || "https://t.me";

  return (
    <footer className="mt-auto w-full border-t border-white/10 bg-bg-deep">
      <div className="mx-auto flex w-full max-w-container flex-col gap-8 px-page-x py-10 md:flex-row md:items-start md:justify-between md:px-page-x-md">
        <div className="max-w-sm space-y-3">
          <p className="font-display text-xl font-bold text-ink">FBC</p>
          <p className="text-base leading-relaxed text-ink">
            FUTO Blockchain Club — building community, skills, and on-chain culture
            at the Federal University of Technology, Owerri.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="label-caps mb-3">Explore</p>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>
                <Link href="/" className="hover:text-cyan transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/hall-of-fame" className="hover:text-cyan transition-colors">
                  Hall of Fame
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-cyan transition-colors">
                  Team
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="label-caps mb-3">Campaigns</p>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>
                <Link
                  href="/ledger-contest"
                  className="hover:text-cyan transition-colors"
                >
                  Ledger Contest
                </Link>
              </li>
              <li>
                <Link
                  href="/ledger-contest/leaderboard"
                  className="hover:text-cyan transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/ledger-contest/signup"
                  className="hover:text-cyan transition-colors"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="label-caps mb-3">Socials</p>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>
                <a
                  href={x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan transition-colors"
                >
                  X / Twitter
                </a>
              </li>
              <li>
                <a
                  href={tg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan transition-colors"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 px-page-x py-4 md:px-page-x-md">
        <p className="mx-auto max-w-container text-center text-xs text-ink-dim md:text-left">
          © {year} FUTO Blockchain Club. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
