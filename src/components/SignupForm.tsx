"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Lock, LockOpen, Send } from "lucide-react";
import { LEVELS, NICHES, SKILL_LEVELS } from "@/lib/constants";
import { SOCIAL_LINKS } from "@/lib/socials";
import { readStoredRef } from "./RefCapture";

type SocialKey = "ledger" | "fbc" | "x";

const socials: {
  key: SocialKey;
  label: string;
  action: string;
  href: string;
  checkbox: string;
}[] = [
  {
    key: "ledger",
    label: "Join Ledger community",
    action: "Open Telegram",
    href: SOCIAL_LINKS.ledgerTelegram,
    checkbox: "I've joined Ledger TG",
  },
  {
    key: "fbc",
    label: "Join FBC",
    action: "Open FBC Telegram",
    href: SOCIAL_LINKS.fbcTelegram,
    checkbox: "I've joined FBC",
  },
  {
    key: "x",
    label: "Follow FBC on X",
    action: "Open X",
    href: SOCIAL_LINKS.fbcX,
    checkbox: "I've followed FBC on X",
  },
];

export function SignupForm() {
  const router = useRouter();
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [clicked, setClicked] = useState<Record<SocialKey, boolean>>({
    ledger: false,
    fbc: false,
    x: false,
  });
  const [checked, setChecked] = useState<Record<SocialKey, boolean>>({
    ledger: false,
    fbc: false,
    x: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setReferredBy(readStoredRef());
  }, []);

  const allVerified = useMemo(
    () => checked.ledger && checked.fbc && checked.x,
    [checked]
  );

  function openSocial(key: SocialKey, href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
    setClicked((c) => ({ ...c, [key]: true }));
  }

  function validate(payload: {
    full_name: string;
    department: string;
    level: string;
    niche: string;
    skill_level: string;
    x_handle: string;
    telegram_username: string;
  }): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!payload.full_name || payload.full_name.length < 2) {
      errs.full_name = "Enter your full name";
    }
    if (!payload.department) errs.department = "Department is required";
    if (!payload.level) errs.level = "Select a level";
    if (!payload.niche) errs.niche = "Select a niche";
    if (!payload.skill_level) errs.skill_level = "Select a skill level";
    if (!payload.x_handle || payload.x_handle.length < 1) {
      errs.x_handle = "X handle is required";
    }
    if (!payload.telegram_username || payload.telegram_username.length < 1) {
      errs.telegram_username = "Telegram username is required";
    }
    return errs;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allVerified || submitting) return;
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: String(fd.get("full_name") || "").trim(),
      department: String(fd.get("department") || "").trim(),
      level: String(fd.get("level") || "").trim(),
      niche: String(fd.get("niche") || "").trim(),
      skill_level: String(fd.get("skill_level") || "").trim(),
      x_handle: String(fd.get("x_handle") || "").trim().replace(/^@/, ""),
      telegram_username: String(fd.get("telegram_username") || "")
        .trim()
        .replace(/^@/, ""),
      referred_by: referredBy || null,
      joined_ledger: checked.ledger,
      joined_fbc: checked.fbc,
      followed_x: checked.x,
    };

    const errs = validate(payload);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError("Fix the highlighted fields before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      router.push(
        `/ledger-contest/thank-you?ref=${encodeURIComponent(data.ref_code)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-10">
      <section className="space-y-4">
        <div>
          <p className="label-caps text-cyan">Verification</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Unlock registration
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Complete the social steps before the form unlocks. Click each link first,
            then check the box (self-attestation).
          </p>
        </div>

        <div className="space-y-3">
          {socials.map((s) => (
            <div key={s.key} className="card-surface !p-4 sm:!p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="label-caps">Required</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-ink">
                    {s.label}
                  </h3>
                </div>
                <label className="flex min-h-[44px] items-center gap-2 text-sm text-ink-muted">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-cyan disabled:opacity-40"
                    disabled={!clicked[s.key]}
                    checked={checked[s.key]}
                    onChange={(e) =>
                      setChecked((c) => ({ ...c, [s.key]: e.target.checked }))
                    }
                  />
                  {s.checkbox}
                </label>
              </div>
              <button
                type="button"
                onClick={() => openSocial(s.key, s.href)}
                className="btn-secondary mt-4 w-full"
              >
                {s.action}
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section
        className={`card-surface transition-opacity ${
          allVerified ? "opacity-100" : "opacity-50 pointer-events-none"
        }`}
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold text-ink">Registration</h2>
          <span className="inline-flex items-center gap-1.5 label-caps">
            {allVerified ? (
              <>
                <LockOpen className="h-3.5 w-3.5 text-cyan" />
                Unlocked
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                Locked
              </>
            )}
          </span>
        </div>

        {referredBy && (
          <div className="mb-6 rounded-btn border border-cyan/25 bg-cyan/10 px-4 py-3 text-sm text-ink">
            Referred by:{" "}
            <span className="font-semibold text-cyan">@{referredBy}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <Field
            label="Full name"
            name="full_name"
            placeholder="Enter full name"
            error={fieldErrors.full_name}
            autoComplete="name"
          />
          <Field
            label="Department"
            name="department"
            placeholder="e.g. Computer Engineering"
            error={fieldErrors.department}
          />
          <Select
            label="Level"
            name="level"
            options={LEVELS}
            error={fieldErrors.level}
          />
          <Select
            label="Niche"
            name="niche"
            options={NICHES}
            error={fieldErrors.niche}
          />
          <Select
            label="Skill level"
            name="skill_level"
            options={SKILL_LEVELS}
            error={fieldErrors.skill_level}
          />
          <Field
            label="X (Twitter) handle"
            name="x_handle"
            placeholder="@username"
            error={fieldErrors.x_handle}
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
          />
          <Field
            label="Telegram username"
            name="telegram_username"
            placeholder="@username"
            error={fieldErrors.telegram_username}
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
          />

          {error && <p className="alert-danger">{error}</p>}

          <button
            type="submit"
            disabled={!allVerified || submitting}
            className="btn-primary w-full text-base"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Submitting…" : "Submit registration"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  error,
  inputMode,
  autoComplete,
  autoCapitalize,
  autoCorrect,
}: {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  inputMode?: "text" | "email" | "tel" | "url";
  autoComplete?: string;
  autoCapitalize?: string;
  autoCorrect?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="label-caps">{label}</span>
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        className={`field-input ${error ? "border-danger/50" : ""}`}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}

function Select({
  label,
  name,
  options,
  error,
}: {
  label: string;
  name: string;
  options: readonly string[];
  error?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="label-caps">{label}</span>
      <select
        name={name}
        defaultValue=""
        className={`field-input ${error ? "border-danger/50" : ""}`}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
