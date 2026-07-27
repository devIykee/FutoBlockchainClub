import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t-2 border-outline-variant bg-navy-deep">
      <div className="mx-auto flex w-full max-w-container flex-col items-center justify-between gap-6 px-margin-mobile py-8 md:flex-row md:px-margin-desktop">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-widest text-electric-light uppercase">
            FBC × Ledger
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 font-mono text-xs uppercase tracking-widest">
          <Link href="/signup" className="text-ink-dim hover:text-electric-light transition-colors">
            Join
          </Link>
          <Link
            href="/leaderboard"
            className="text-ink-dim hover:text-electric-light transition-colors"
          >
            Leaderboard
          </Link>
          <a
            href={process.env.NEXT_PUBLIC_FBC_X_LINK || "https://x.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-dim hover:text-electric-light transition-colors"
          >
            X / Twitter
          </a>
          <a
            href={process.env.NEXT_PUBLIC_FBC_TG_LINK || "https://t.me"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-dim hover:text-electric-light transition-colors"
          >
            Telegram
          </a>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-dim opacity-80">
          © {new Date().getFullYear()} FUTO Blockchain Club. Contest ends Aug 1.
        </p>
      </div>
    </footer>
  );
}
