"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Signup } from "@/lib/types";
import { LEVELS, NICHES } from "@/lib/constants";

export function AdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loadError] = useState<string | null>(null);
  const [nicheFilter, setNicheFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sortKey, setSortKey] = useState<"created_at" | "full_name">("created_at");

  const check = useCallback(async () => {
    const res = await fetch("/api/admin/signups");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    if (!res.ok) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setSignups(data.signups || []);
    setAuthed(true);
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  async function login(e: FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoginError(data.error || "Invalid password");
      return;
    }
    setPassword("");
    await check();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setSignups([]);
  }

  const filtered = useMemo(() => {
    let rows = [...signups];
    if (nicheFilter) rows = rows.filter((r) => r.niche === nicheFilter);
    if (levelFilter) rows = rows.filter((r) => r.level === levelFilter);
    rows.sort((a, b) => {
      if (sortKey === "full_name") return a.full_name.localeCompare(b.full_name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return rows;
  }, [signups, nicheFilter, levelFilter, sortKey]);

  function exportCsv() {
    const headers = [
      "full_name",
      "department",
      "level",
      "niche",
      "skill_level",
      "x_handle",
      "telegram_username",
      "ref_code",
      "referred_by",
      "joined_ledger",
      "joined_fbc",
      "followed_x",
      "created_at",
    ];
    const escape = (v: unknown) => {
      const s = String(v ?? "");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const lines = [
      headers.join(","),
      ...filtered.map((r) => {
        const row = r as unknown as Record<string, unknown>;
        return headers.map((h) => escape(row[h])).join(",");
      }),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fbc-signups-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (authed === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-mono text-sm text-ink-dim">
        Checking session…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <form
          onSubmit={login}
          className="w-full max-w-md border border-electric/60 bg-navy-card p-8 relative"
        >
          <span className="absolute -top-3 left-4 bg-navy px-2 font-mono text-[10px] uppercase tracking-widest text-electric-light">
            Secure access
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white">
            Restricted area
          </h1>
          <p className="mt-2 font-body text-sm text-ink-muted">
            Enter the admin password to access contest analytics.
          </p>
          <label className="mt-8 block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
              Access token
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-outline-variant bg-navy-deep px-4 py-3 font-mono text-ink outline-none focus:border-electric"
              autoComplete="current-password"
            />
          </label>
          {loginError && (
            <p className="mt-3 font-mono text-xs text-accent-coral">{loginError}</p>
          )}
          <button
            type="submit"
            className="mt-6 w-full bg-electric py-3.5 font-display font-bold uppercase tracking-widest text-white hover:bg-white hover:text-electric transition-colors"
          >
            Initialize session
          </button>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-accent-coral/80">
            ⚠ Unauthorized access is logged.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-container px-margin-mobile py-10 md:px-margin-desktop">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-electric-light">
            {"// Admin console"}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase text-white">
            Signups ({filtered.length})
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="border border-electric px-4 py-2 font-mono text-xs uppercase tracking-widest text-electric-light hover:bg-electric/10"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={logout}
            className="border border-outline-variant px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-muted hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={nicheFilter}
          onChange={(e) => setNicheFilter(e.target.value)}
          className="border border-outline-variant bg-navy-card px-3 py-2 font-mono text-xs text-ink"
        >
          <option value="">All niches</option>
          {NICHES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="border border-outline-variant bg-navy-card px-3 py-2 font-mono text-xs text-ink"
        >
          <option value="">All levels</option>
          {LEVELS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as "created_at" | "full_name")}
          className="border border-outline-variant bg-navy-card px-3 py-2 font-mono text-xs text-ink"
        >
          <option value="created_at">Sort: newest</option>
          <option value="full_name">Sort: name</option>
        </select>
        <button
          type="button"
          onClick={check}
          className="border border-outline-variant px-3 py-2 font-mono text-xs uppercase tracking-widest text-ink-muted hover:text-white"
        >
          Refresh
        </button>
      </div>

      {loadError && (
        <p className="mb-4 font-mono text-xs text-accent-coral">{loadError}</p>
      )}

      <div className="overflow-x-auto border border-outline-variant">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-navy-card font-mono text-[10px] uppercase tracking-widest text-ink-dim">
              {[
                "Name",
                "Dept",
                "Level",
                "Niche",
                "Skill",
                "X",
                "TG",
                "Ref",
                "By",
                "Created",
              ].map((h) => (
                <th key={h} className="px-3 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-outline-variant/50 font-body text-ink hover:bg-electric/5"
              >
                <td className="px-3 py-3 whitespace-nowrap text-white">{r.full_name}</td>
                <td className="px-3 py-3 whitespace-nowrap">{r.department}</td>
                <td className="px-3 py-3">{r.level}</td>
                <td className="px-3 py-3 whitespace-nowrap">{r.niche}</td>
                <td className="px-3 py-3">{r.skill_level}</td>
                <td className="px-3 py-3 font-mono text-xs">@{r.x_handle}</td>
                <td className="px-3 py-3 font-mono text-xs">@{r.telegram_username}</td>
                <td className="px-3 py-3 font-mono text-xs text-electric-light">
                  {r.ref_code}
                </td>
                <td className="px-3 py-3 font-mono text-xs">{r.referred_by || "—"}</td>
                <td className="px-3 py-3 font-mono text-xs whitespace-nowrap">
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-3 py-10 text-center text-ink-dim">
                  No signups match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
