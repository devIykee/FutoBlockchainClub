"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export function ThankYouClient({ refCode }: { refCode: string }) {
  const [copied, setCopied] = useState(false);

  const referralUrl = useMemo(() => {
    if (typeof window === "undefined") return `/?ref=${refCode}`;
    return `${window.location.origin}/?ref=${encodeURIComponent(refCode)}`;
  }, [refCode]);

  const shareText = encodeURIComponent(
    `I just joined the FBC × Ledger Invite Contest at FUTO. Sign up with my link and let's climb the leaderboard: ${
      typeof window !== "undefined"
        ? `${window.location.origin}/?ref=${refCode}`
        : `/?ref=${refCode}`
    }`
  );

  async function copy() {
    try {
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/?ref=${encodeURIComponent(refCode)}`
          : referralUrl;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value =
        typeof window !== "undefined"
          ? `${window.location.origin}/?ref=${encodeURIComponent(refCode)}`
          : referralUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const liveUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${encodeURIComponent(refCode)}`
      : `/?ref=${refCode}`;

  return (
    <div className="mx-auto w-full max-w-lg px-margin-mobile py-16 md:px-0">
      <p className="font-mono text-xs uppercase tracking-widest text-electric-light">
        {"// Registration verified"}
      </p>
      <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-none tracking-tight text-electric-light md:text-6xl">
        You&apos;re in!
      </h1>
      <p className="mt-3 font-mono text-xs uppercase tracking-widest text-ink-dim">
        Ref code: {refCode}
      </p>

      <div className="mt-10 border border-electric/50 bg-navy-card p-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-electric-light">
          Amplify your reach
        </p>
        <p className="mt-2 font-body text-ink-muted">
          Share your unique link. Every signup that uses it boosts your rank on the live
          leaderboard.
        </p>

        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
            Unique referral endpoint
          </p>
          <div className="mt-2 flex items-center gap-2 border border-outline-variant bg-navy-deep px-3 py-3">
            <code className="flex-1 truncate font-mono text-xs text-electric-light">
              {liveUrl}
            </code>
          </div>
          <button
            type="button"
            onClick={copy}
            className="clip-button mt-3 w-full bg-electric py-3.5 font-display font-bold uppercase tracking-widest text-white hover:bg-white hover:text-electric transition-colors"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <ShareLink
          href={`https://twitter.com/intent/tweet?text=${shareText}`}
          label="Share on X"
        />
        <ShareLink
          href={`https://t.me/share/url?url=${encodeURIComponent(liveUrl)}&text=${encodeURIComponent(
            "Join the FBC × Ledger Invite Contest with my link!"
          )}`}
          label="Share on Telegram"
        />
        <ShareLink
          href={`https://wa.me/?text=${shareText}`}
          label="Share on WhatsApp"
        />
      </div>

      <Link
        href="/leaderboard"
        className="mt-8 flex items-center justify-between border border-accent-coral/50 bg-accent-coral/5 px-5 py-4 transition-colors hover:bg-accent-coral/10"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent-coral">
            View your rank
          </p>
          <p className="font-display text-sm font-semibold uppercase text-white">
            Open live leaderboard
          </p>
        </div>
        <span className="text-accent-coral text-xl">→</span>
      </Link>

      <div className="mt-10 space-y-3 border-t border-outline-variant pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-dim">
          Prestige status: initiated
        </p>
        <ul className="space-y-2 font-body text-sm text-ink-muted">
          <li>✓ Contest access granted</li>
          <li>✓ Personal referral link active</li>
          <li>○ Climb into the top 5 for prizes</li>
        </ul>
      </div>
    </div>
  );
}

function ShareLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center border border-outline-variant bg-navy-card px-4 py-3.5 font-mono text-xs uppercase tracking-widest text-ink hover:border-electric hover:text-electric-light transition-colors"
    >
      {label}
    </a>
  );
}
