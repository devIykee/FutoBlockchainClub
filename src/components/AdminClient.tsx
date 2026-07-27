"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Signup } from "@/lib/types";
import { LEVELS, NICHES } from "@/lib/constants";

export function AdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [nicheFilter, setNicheFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sortKey, setSortKey] = useState<"created_at" | "full_name">("created_at");
  const [refreshing, setRefreshing] = useState(false);

  const loadSignups = useCallback(async () => {
    setRefreshing(true);
    setLoadError(null);
    try {
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
    } catch {
      setLoadError("Failed to load signups");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Fetch once on load — no auto-poll (free-tier discipline)
    loadSignups();
  }, [loadSignups]);

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
    await loadSignups();
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
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-ink-muted">
        Checking session…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <form onSubmit={login} className="glass-strong w-full max-w-md rounded-panel p-8">
          <p className="label-caps text-cyan">Secure access</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">
            Admin
          </h1>
          <p className="mt-2 text-base leading-relaxed text-ink">
            Enter the admin password to view contest signups.
          </p>
          <label className="mt-8 block space-y-1.5">
            <span className="label-caps">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="field-input"
              autoComplete="current-password"
            />
          </label>
          {loginError && <p className="mt-3 text-sm text-danger">{loginError}</p>}
          <button type="submit" className="btn-primary mt-6 w-full">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-container page-pad py-10 md:py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="label-caps">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">
            Signups ({filtered.length})
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportCsv} className="btn-secondary">
            Export CSV
          </button>
          <button
            type="button"
            onClick={loadSignups}
            disabled={refreshing}
            className="btn-secondary"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <button type="button" onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={nicheFilter}
          onChange={(e) => setNicheFilter(e.target.value)}
          className="field-input w-auto min-w-[140px]"
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
          className="field-input w-auto min-w-[120px]"
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
          className="field-input w-auto min-w-[140px]"
        >
          <option value="created_at">Sort: newest</option>
          <option value="full_name">Sort: name</option>
        </select>
      </div>

      {loadError && <p className="mb-4 alert-danger">{loadError}</p>}

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-card border border-white/10 md:block">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-bg-card label-caps">
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
                className="border-b border-white/5 text-ink hover:bg-cyan/5"
              >
                <td className="px-3 py-3 whitespace-nowrap font-medium">{r.full_name}</td>
                <td className="px-3 py-3 whitespace-nowrap">{r.department}</td>
                <td className="px-3 py-3">{r.level}</td>
                <td className="px-3 py-3 whitespace-nowrap">{r.niche}</td>
                <td className="px-3 py-3">{r.skill_level}</td>
                <td className="px-3 py-3 text-xs">@{r.x_handle}</td>
                <td className="px-3 py-3 text-xs">@{r.telegram_username}</td>
                <td className="px-3 py-3 text-xs text-cyan">{r.ref_code}</td>
                <td className="px-3 py-3 text-xs">{r.referred_by || "—"}</td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-3 py-10 text-center text-ink-muted">
                  No signups match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((r) => (
          <div key={r.id} className="card-surface p-4 space-y-2 text-sm">
            <p className="font-display text-lg font-semibold text-ink">{r.full_name}</p>
            <p className="text-ink-muted">
              {r.department} · Level {r.level}
            </p>
            <p className="text-ink-muted">
              {r.niche} · {r.skill_level}
            </p>
            <p>
              X @{r.x_handle} · TG @{r.telegram_username}
            </p>
            <p className="text-cyan">ref: {r.ref_code}</p>
            <p className="text-xs text-ink-dim">
              by: {r.referred_by || "—"} · {new Date(r.created_at).toLocaleString()}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-ink-muted">No signups match filters.</p>
        )}
      </div>
    </div>
  );
}
