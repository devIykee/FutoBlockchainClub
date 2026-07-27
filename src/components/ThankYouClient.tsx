"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export function ThankYouClient({ refCode }: { refCode: string }) {
  const [copied, setCopied] = useState(false);

  const liveUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `/?ref=${encodeURIComponent(refCode)}`;
    }
    return `${window.location.origin}/?ref=${encodeURIComponent(refCode)}`;
  }, [refCode]);

  const shareText = useMemo(() => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/?ref=${refCode}`
        : `/?ref=${refCode}`;
    return encodeURIComponent(
      `I just joined the FBC Ledger Invite Contest. Sign up with my link and climb the leaderboard: ${url}`
    );
  }, [refCode]);

  async function copy() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/?ref=${encodeURIComponent(refCode)}`
        : liveUrl;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto w-full max-w-lg px-page-x py-14 md:px-0">
      <p className="label-caps text-cyan">Registration confirmed</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-cyan md:text-5xl">
        You&apos;re in!
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Your referral code:{" "}
        <span className="font-semibold text-ink">{refCode}</span>
      </p>

      <div className="card-surface mt-10 p-6">
        <p className="label-caps text-cyan">Amplify your reach</p>
        <p className="mt-2 text-base leading-relaxed text-ink">
          Share your unique link. Every signup that uses it boosts your rank on the
          live leaderboard.
        </p>
        <div className="mt-6">
          <p className="label-caps">Your referral link</p>
          <div className="mt-2 rounded-btn border border-white/10 bg-bg-deep px-3 py-3">
            <code className="block truncate text-sm text-cyan">{liveUrl}</code>
          </div>
          <button type="button" onClick={copy} className="btn-primary mt-3 w-full">
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
            "Join the FBC Ledger Invite Contest with my link!"
          )}`}
          label="Share on Telegram"
        />
        <ShareLink href={`https://wa.me/?text=${shareText}`} label="Share on WhatsApp" />
      </div>

      <Link
        href="/ledger-contest/leaderboard"
        className="mt-8 flex items-center justify-between rounded-card border border-cyan/30 bg-cyan/5 px-5 py-4 transition-colors hover:bg-cyan/10"
      >
        <div>
          <p className="label-caps text-cyan">View rankings</p>
          <p className="font-display text-sm font-semibold text-ink">
            Open live leaderboard
          </p>
        </div>
        <span className="text-xl text-cyan">→</span>
      </Link>
    </div>
  );
}

function ShareLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary w-full"
    >
      {label}
    </a>
  );
}
