"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  Link2,
  MessageCircle,
  Send,
} from "lucide-react";
import {
  readSignupSession,
  writeSignupSession,
} from "@/lib/signup-session";

export function ThankYouClient({ refCode }: { refCode: string }) {
  const [copied, setCopied] = useState(false);

  // Persist registration on this device when they land with a ref code
  useEffect(() => {
    if (!refCode) return;
    const existing = readSignupSession();
    if (existing?.ref_code === refCode) return;
    writeSignupSession({
      ref_code: refCode,
      full_name: existing?.full_name || "Contestant",
      phone: existing?.phone,
      department: existing?.department,
      level: existing?.level,
      niche: existing?.niche,
      skill_level: existing?.skill_level,
      x_handle: existing?.x_handle,
      telegram_username: existing?.telegram_username,
      referred_by: existing?.referred_by ?? null,
      referral_count: existing?.referral_count,
    });
  }, [refCode]);

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
    <div className="mx-auto w-full max-w-lg page-pad py-12 md:py-16">
      <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-cyan/15 text-cyan">
        <Check className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <p className="mt-4 label-caps">Registration confirmed</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
        You&apos;re in!
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Your referral code:{" "}
        <span className="font-semibold text-ink">{refCode}</span>
      </p>

      <div className="card-surface mt-8">
        <p className="label-caps">Amplify your reach</p>
        <p className="mt-2 text-base leading-relaxed text-ink">
          Share your unique link. Every signup that uses it boosts your rank on the live
          leaderboard.
        </p>
        <div className="mt-6">
          <p className="label-caps">Your referral link</p>
          <div className="mt-2 flex items-center gap-2 rounded-btn border border-white/10 bg-bg-deep px-3 py-3">
            <Link2 className="h-4 w-4 shrink-0 text-ink-muted" />
            <code className="block truncate text-sm text-ink">{liveUrl}</code>
          </div>
          <button type="button" onClick={copy} className="btn-primary mt-3 w-full">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy link
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <ShareLink
          href={`https://twitter.com/intent/tweet?text=${shareText}`}
          label="Share on X"
          icon={<XIcon className="h-4 w-4" />}
        />
        <ShareLink
          href={`https://t.me/share/url?url=${encodeURIComponent(liveUrl)}&text=${encodeURIComponent(
            "Join the FBC Ledger Invite Contest with my link!"
          )}`}
          label="Share on Telegram"
          icon={<Send className="h-4 w-4" />}
        />
        <ShareLink
          href={`https://wa.me/?text=${shareText}`}
          label="Share on WhatsApp"
          icon={<MessageCircle className="h-4 w-4" />}
        />
      </div>

      <Link
        href="/ledger-contest/leaderboard"
        className="mt-8 flex items-center justify-between rounded-card border border-white/10 bg-bg-elevated px-5 py-4 transition-colors hover:border-cyan/30"
      >
        <div>
          <p className="label-caps">View rankings</p>
          <p className="font-display text-sm font-semibold text-ink">
            Open live leaderboard
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-cyan" />
      </Link>

      <Link
        href="/ledger-contest/signup"
        className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-ink-muted hover:text-cyan transition-colors"
      >
        View my registration on this device
      </Link>
    </div>
  );
}

function ShareLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary w-full"
    >
      {icon}
      {label}
    </a>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}
