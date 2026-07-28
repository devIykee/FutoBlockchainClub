"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  Link2,
  LogOut,
  RefreshCw,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import type { SignupSession } from "@/lib/signup-session";
import {
  clearSignupSession,
  writeSignupSession,
} from "@/lib/signup-session";
import { formatPhoneDisplay, isValidPhone, normalizePhone } from "@/lib/phone";

type Props = {
  /** Known session from this device */
  session: SignupSession | null;
  onSession: (s: SignupSession | null) => void;
  /** Show compact "already registered?" on empty state */
  allowRecover?: boolean;
};

export function RegistrationPanel({
  session,
  onSession,
  allowRecover = true,
}: Props) {
  const [phone, setPhone] = useState("");
  const [looking, setLooking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showRecover, setShowRecover] = useState(!session);

  async function refreshByPhone(phoneValue: string, silent = false) {
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch("/api/signup/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneValue }),
        cache: "no-store",
      });
      if (!res.ok) return false;
      const data = await res.json();
      const reg = data.registration as SignupSession | undefined;
      if (!reg?.ref_code) return false;
      const next: SignupSession = {
        ...reg,
        saved_at: new Date().toISOString(),
      };
      writeSignupSession(next);
      onSession(next);
      return true;
    } catch {
      return false;
    } finally {
      if (!silent) setRefreshing(false);
    }
  }

  // Refresh referrals / profile when we already know the phone
  useEffect(() => {
    if (!session?.phone) return;
    let cancelled = false;
    (async () => {
      const ok = await refreshByPhone(session.phone!, true);
      if (cancelled && !ok) {
        // keep cached
      }
    })();
    return () => {
      cancelled = true;
    };
    // only re-run when phone identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.phone]);

  const liveUrl = useMemo(() => {
    if (!session?.ref_code) return "";
    if (typeof window === "undefined") {
      return `/?ref=${encodeURIComponent(session.ref_code)}`;
    }
    return `${window.location.origin}/?ref=${encodeURIComponent(session.ref_code)}`;
  }, [session?.ref_code]);

  async function lookup(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValidPhone(phone)) {
      setError("Enter a valid phone number (e.g. 0801 234 5678)");
      return;
    }
    setLooking(true);
    try {
      const res = await fetch("/api/signup/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizePhone(phone) || phone }),
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      const reg = data.registration as SignupSession;
      const next: SignupSession = {
        ...reg,
        saved_at: new Date().toISOString(),
      };
      writeSignupSession(next);
      onSession(next);
      setShowRecover(false);
      setPhone("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLooking(false);
    }
  }

  async function copyLink() {
    if (!liveUrl) return;
    try {
      await navigator.clipboard.writeText(liveUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = liveUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function signOutDevice() {
    clearSignupSession();
    onSession(null);
    setShowRecover(true);
  }

  if (session) {
    return (
      <div className="card-surface space-y-5">
        <div>
          <p className="label-caps text-cyan">You&apos;re registered</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">
            Welcome back, {session.full_name.split(/\s+/)[0]}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            This device remembers your contest registration. Share your link or
            recover it anytime with your phone number.
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Fact label="Full name" value={session.full_name} />
          {session.phone && (
            <Fact label="Phone" value={formatPhoneDisplay(session.phone)} />
          )}
          {session.department && (
            <Fact label="Department" value={session.department} />
          )}
          {session.level && <Fact label="Level" value={session.level} />}
          {session.niche && <Fact label="Niche" value={session.niche} />}
          {session.skill_level && (
            <Fact label="Skill" value={session.skill_level} />
          )}
          {session.x_handle && (
            <Fact label="X" value={`@${session.x_handle}`} />
          )}
          {session.telegram_username && (
            <Fact label="Telegram" value={`@${session.telegram_username}`} />
          )}
          <Fact label="Referral code" value={session.ref_code} />
          <Fact
            label="Successful referrals"
            value={String(
              session.referrals?.length ?? session.referral_count ?? 0
            )}
          />
        </dl>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="label-caps inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              People you referred
            </p>
            {session.phone && (
              <button
                type="button"
                onClick={() => refreshByPhone(session.phone!)}
                disabled={refreshing}
                className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-cyan disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Updating…" : "Refresh"}
              </button>
            )}
          </div>
          {(session.referrals?.length ?? 0) === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">
              Nobody has used your link yet. Share it with classmates to climb
              the leaderboard.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {session.referrals!.map((r, i) => (
                <li
                  key={`${r.full_name}-${r.created_at || i}`}
                  className="rounded-btn border border-theme bg-bg-high/50 px-3 py-2.5"
                >
                  <p className="font-medium text-ink">{r.full_name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {[r.department, r.level ? `Level ${r.level}` : null, r.niche]
                      .filter(Boolean)
                      .join(" · ")}
                    {r.created_at
                      ? ` · joined ${new Date(r.created_at).toLocaleDateString()}`
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="label-caps">Your referral link</p>
          <div className="mt-2 flex items-center gap-2 rounded-btn border border-theme bg-bg-deep px-3 py-3">
            <Link2 className="h-4 w-4 shrink-0 text-ink-muted" />
            <code className="block truncate text-sm text-ink">{liveUrl}</code>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={copyLink} className="btn-primary flex-1">
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
            <Link
              href={`/ledger-contest/thank-you?ref=${encodeURIComponent(session.ref_code)}`}
              className="btn-secondary flex-1"
            >
              Share page
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <Link
          href="/ledger-contest/leaderboard"
          className="flex items-center justify-between rounded-card border border-theme bg-bg-elevated px-4 py-3 transition-colors hover:border-cyan/30"
        >
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-cyan" />
            <span className="text-sm font-medium text-ink">Live leaderboard</span>
          </div>
          <ArrowRight className="h-4 w-4 text-cyan" />
        </Link>

        <div className="flex flex-wrap gap-2 border-t border-theme pt-4">
          <button
            type="button"
            onClick={() => setShowRecover(true)}
            className="btn-secondary !px-3 text-sm"
          >
            <Search className="h-4 w-4" />
            Look up another number
          </button>
          <button
            type="button"
            onClick={signOutDevice}
            className="btn-secondary !px-3 text-sm"
          >
            <LogOut className="h-4 w-4" />
            Forget this device
          </button>
        </div>

        {showRecover && (
          <RecoverForm
            phone={phone}
            setPhone={setPhone}
            looking={looking}
            error={error}
            onSubmit={lookup}
          />
        )}
      </div>
    );
  }

  if (!allowRecover) return null;

  return (
    <div className="card-surface space-y-4">
      <div>
        <p className="label-caps">Already registered?</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-ink">
          Recover your referral link
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Enter the phone number you used to sign up. We&apos;ll show your link
          and registration details on this device.
        </p>
      </div>
      <RecoverForm
        phone={phone}
        setPhone={setPhone}
        looking={looking}
        error={error}
        onSubmit={lookup}
      />
    </div>
  );
}

function RecoverForm({
  phone,
  setPhone,
  looking,
  error,
  onSubmit,
}: {
  phone: string;
  setPhone: (v: string) => void;
  looking: boolean;
  error: string | null;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block space-y-1.5">
        <span className="label-caps">Phone number</span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0801 234 5678"
          className="field-input"
          required
        />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={looking} className="btn-primary w-full">
        <Search className="h-4 w-4" />
        {looking ? "Looking up…" : "Find my registration"}
      </button>
    </form>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-btn border border-theme bg-bg-high/60 px-3 py-2">
      <dt className="label-caps text-[10px]">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink break-words">{value}</dd>
    </div>
  );
}
