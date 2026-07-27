"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LEVELS, NICHES, SKILL_LEVELS } from "@/lib/constants";
import { readStoredRef } from "./RefCapture";

type SocialKey = "ledger" | "fbc" | "x";

const socials: {
  key: SocialKey;
  label: string;
  action: string;
  env: string;
  fallback: string;
  checkbox: string;
}[] = [
  {
    key: "ledger",
    label: "Join Ledger community",
    action: "Launch Telegram",
    env: "NEXT_PUBLIC_LEDGER_TG_LINK",
    fallback: "https://t.me",
    checkbox: "I've joined Ledger TG",
  },
  {
    key: "fbc",
    label: "Join FBC",
    action: "Launch Portal",
    env: "NEXT_PUBLIC_FBC_TG_LINK",
    fallback: "https://t.me",
    checkbox: "I've joined FBC",
  },
  {
    key: "x",
    label: "Follow FBC on X",
    action: "Follow on X",
    env: "NEXT_PUBLIC_FBC_X_LINK",
    fallback: "https://x.com",
    checkbox: "I've followed FBC on X",
  },
];

function linkFor(env: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  // Public env vars are inlined at build time
  const map: Record<string, string | undefined> = {
    NEXT_PUBLIC_LEDGER_TG_LINK: process.env.NEXT_PUBLIC_LEDGER_TG_LINK,
    NEXT_PUBLIC_FBC_TG_LINK: process.env.NEXT_PUBLIC_FBC_TG_LINK,
    NEXT_PUBLIC_FBC_X_LINK: process.env.NEXT_PUBLIC_FBC_X_LINK,
  };
  return map[env] || fallback;
}

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

  useEffect(() => {
    setReferredBy(readStoredRef());
  }, []);

  const allVerified = useMemo(
    () => checked.ledger && checked.fbc && checked.x,
    [checked]
  );

  function openSocial(key: SocialKey, env: string, fallback: string) {
    const url = linkFor(env, fallback);
    window.open(url, "_blank", "noopener,noreferrer");
    setClicked((c) => ({ ...c, [key]: true }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allVerified || submitting) return;
    setError(null);
    setSubmitting(true);

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

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }
      router.push(`/thank-you?ref=${encodeURIComponent(data.ref_code)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-10">
      {/* Social verification */}
      <section className="space-y-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-electric-light">
            {"// Verification phase_01"}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
            Unlock registration
          </h2>
          <p className="mt-2 font-body text-ink-muted">
            Complete the required social steps before the form unlocks. Self-attestation
            only — click each link first, then check the box.
          </p>
        </div>

        <div className="space-y-3">
          {socials.map((s, i) => (
            <div
              key={s.key}
              className="border border-outline-variant bg-navy-card p-4 transition-colors hover:border-electric/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                    Required / 0{i + 1}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold uppercase text-white">
                    {s.label}
                  </h3>
                </div>
                <label className="flex items-center gap-2 font-mono text-[10px] uppercase text-ink-muted">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-electric disabled:opacity-40"
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
                onClick={() => openSocial(s.key, s.env, s.fallback)}
                className="mt-4 w-full border border-electric/40 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-electric-light hover:bg-electric/10 transition-colors"
              >
                {s.action} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Registration form */}
      <section
        className={`border-2 p-6 md:p-8 transition-opacity ${
          allVerified
            ? "border-electric bg-navy-card opacity-100"
            : "border-outline-variant bg-navy-deep opacity-50 pointer-events-none"
        }`}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
            Registration terminal
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
            {allVerified ? "System_unlocked" : "System_locked"}
          </span>
        </div>

        {referredBy && (
          <div className="mb-6 border border-electric/40 bg-electric/10 px-4 py-3 font-mono text-xs text-electric-light">
            Referred by: <span className="font-bold">@{referredBy}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <Field label="Full name" name="full_name" placeholder="Enter full name" required />
          <Field
            label="Department"
            name="department"
            placeholder="e.g. Computer Engineering"
            required
          />
          <Select label="Level" name="level" options={LEVELS} required />
          <Select label="Niche" name="niche" options={NICHES} required />
          <Select label="Skill level" name="skill_level" options={SKILL_LEVELS} required />
          <Field label="X (Twitter) handle" name="x_handle" placeholder="@username" required />
          <Field
            label="Telegram username"
            name="telegram_username"
            placeholder="@username"
            required
          />

          {error && (
            <p className="border border-accent-coral/50 bg-accent-coral/10 px-3 py-2 font-mono text-xs text-accent-coral">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!allVerified || submitting}
            className="clip-button hard-shadow w-full bg-electric py-4 font-display text-lg font-bold uppercase tracking-widest text-white transition-all enabled:hover:bg-white enabled:hover:text-electric disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Submitting…" : "Initialize submission"}
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
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
        {label}
      </span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full border border-outline-variant bg-navy-deep px-4 py-3 font-body text-ink outline-none placeholder:text-ink-dim/50 focus:border-electric"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
        {label}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full border border-outline-variant bg-navy-deep px-4 py-3 font-body text-ink outline-none focus:border-electric"
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
    </label>
  );
}
