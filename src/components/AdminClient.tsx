"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Download, LogOut, Plus, RefreshCw, Trash2, Pencil } from "lucide-react";
import type { HallOfFameRow, Signup, TeamMemberRow } from "@/lib/types";
import { LEVELS, NICHES } from "@/lib/constants";

type Tab = "signups" | "team" | "hof";

export function AdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("signups");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [signups, setSignups] = useState<Signup[]>([]);
  const [team, setTeam] = useState<TeamMemberRow[]>([]);
  const [hof, setHof] = useState<HallOfFameRow[]>([]);
  const [nicheFilter, setNicheFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sortKey, setSortKey] = useState<"created_at" | "full_name">("created_at");
  const [refreshing, setRefreshing] = useState(false);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/signups");
    if (res.status === 401) {
      setAuthed(false);
      return false;
    }
    if (!res.ok) {
      setAuthed(false);
      return false;
    }
    setAuthed(true);
    return true;
  }, []);

  const loadAll = useCallback(async () => {
    setRefreshing(true);
    setLoadError(null);
    try {
      const ok = await checkAuth();
      if (!ok) return;

      const [sRes, tRes, hRes] = await Promise.all([
        fetch("/api/admin/signups"),
        fetch("/api/admin/team"),
        fetch("/api/admin/hall-of-fame"),
      ]);

      if (sRes.ok) {
        const d = await sRes.json();
        setSignups(d.signups || []);
      }
      if (tRes.ok) {
        const d = await tRes.json();
        setTeam(d.members || []);
      }
      if (hRes.ok) {
        const d = await hRes.json();
        setHof(d.entries || []);
      }
    } catch {
      setLoadError("Failed to load admin data");
    } finally {
      setRefreshing(false);
    }
  }, [checkAuth]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

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
    await loadAll();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setSignups([]);
    setTeam([]);
    setHof([]);
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
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Checking session…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <form onSubmit={login} className="w-full max-w-md bg-white dark:bg-gray-950 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Secure access</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Admin</h1>
          <p className="mt-2 text-base leading-relaxed text-gray-600 dark:text-gray-400">
            Enter the admin password to manage contest signups, team, and Hall of Fame.
          </p>
          <label className="mt-8 block space-y-1.5">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
            />
          </label>
          {loginError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{loginError}</p>}
          <button type="submit" className="mt-6 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "signups", label: `Signups (${signups.length})` },
    { id: "team", label: `Team (${team.length})` },
    { id: "hof", label: `Hall of Fame (${hof.length})` },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadAll}
            disabled={refreshing}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          {tab === "signups" && (
            <button type="button" onClick={exportCsv} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
          <button type="button" onClick={logout} className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium min-h-[44px] rounded-lg transition-colors ${
              tab === t.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loadError && <p className="mb-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{loadError}</p>}

      {tab === "signups" && (
        <SignupsPanel
          filtered={filtered}
          nicheFilter={nicheFilter}
          setNicheFilter={setNicheFilter}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
          sortKey={sortKey}
          setSortKey={setSortKey}
        />
      )}
      {tab === "team" && (
        <TeamPanel members={team} onChange={loadAll} setError={setLoadError} />
      )}
      {tab === "hof" && (
        <HofPanel entries={hof} onChange={loadAll} setError={setLoadError} />
      )}
    </div>
  );
}

function SignupsPanel({
  filtered,
  nicheFilter,
  setNicheFilter,
  levelFilter,
  setLevelFilter,
  sortKey,
  setSortKey,
}: {
  filtered: Signup[];
  nicheFilter: string;
  setNicheFilter: (v: string) => void;
  levelFilter: string;
  setLevelFilter: (v: string) => void;
  sortKey: "created_at" | "full_name";
  setSortKey: (v: "created_at" | "full_name") => void;
}) {
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={nicheFilter}
          onChange={(e) => setNicheFilter(e.target.value)}
          className="w-auto min-w-[140px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-auto min-w-[120px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-auto min-w-[140px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="created_at">Sort: newest</option>
          <option value="full_name">Sort: name</option>
        </select>
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 md:block">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
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
                <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 whitespace-nowrap font-medium">{r.full_name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.department}</td>
                <td className="px-4 py-3">{r.level}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.niche}</td>
                <td className="px-4 py-3">{r.skill_level}</td>
                <td className="px-4 py-3 text-xs">@{r.x_handle}</td>
                <td className="px-4 py-3 text-xs">@{r.telegram_username}</td>
                <td className="px-4 py-3 text-xs text-blue-600 dark:text-blue-400">{r.ref_code}</td>
                <td className="px-4 py-3 text-xs">{r.referred_by || "-"}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap">
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                  No signups match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-sm">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{r.full_name}</p>
            <p className="text-gray-600 dark:text-gray-400">
              {r.department} · Level {r.level}
            </p>
            <p className="text-blue-600 dark:text-blue-400">ref: {r.ref_code}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function TeamPanel({
  members,
  onChange,
  setError,
}: {
  members: TeamMemberRow[];
  onChange: () => Promise<void>;
  setError: (s: string | null) => void;
}) {
  const blank = {
    name: "",
    role: "",
    photo: "",
    x: "",
    github: "",
    linkedin: "",
    sort_order: 0,
  };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEdit(m: TeamMemberRow) {
    setEditId(m.id);
    setForm({
      name: m.name,
      role: m.role,
      photo: m.photo || "",
      x: m.x || "",
      github: m.github || "",
      linkedin: m.linkedin || "",
      sort_order: m.sort_order ?? 0,
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(blank);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId || undefined,
          ...form,
          sort_order: Number(form.sort_order) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      cancelEdit();
      await onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this team member?")) return;
    setError(null);
    const res = await fetch(`/api/admin/team?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Delete failed");
      return;
    }
    if (editId === id) cancelEdit();
    await onChange();
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <form onSubmit={save} className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6 lg:col-span-2 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {editId ? "Edit member" : "Add member"}
        </h2>
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
        <Field
          label="Role / title"
          value={form.role}
          onChange={(v) => setForm((f) => ({ ...f, role: v }))}
          required
        />
        <Field
          label="Photo URL"
          value={form.photo}
          onChange={(v) => setForm((f) => ({ ...f, photo: v }))}
          placeholder="https://…"
        />
        <Field
          label="X URL"
          value={form.x}
          onChange={(v) => setForm((f) => ({ ...f, x: v }))}
        />
        <Field
          label="GitHub URL"
          value={form.github}
          onChange={(v) => setForm((f) => ({ ...f, github: v }))}
        />
        <Field
          label="LinkedIn URL"
          value={form.linkedin}
          onChange={(v) => setForm((f) => ({ ...f, linkedin: v }))}
        />
        <Field
          label="Sort order"
          value={String(form.sort_order)}
          onChange={(v) => setForm((f) => ({ ...f, sort_order: Number(v) || 0 }))}
          inputMode="numeric"
        />
        <div className="flex flex-wrap gap-2 pt-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {saving ? "Saving…" : editId ? "Update" : "Add member"}
          </button>
          {editId && (
            <button type="button" onClick={cancelEdit} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3 lg:col-span-3">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{m.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{m.role}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                order {m.sort_order}
                {m.x ? " · X" : ""}
                {m.github ? " · GH" : ""}
                {m.linkedin ? " · LI" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(m)} className="px-3 py-2 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-1">
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(m.id)}
                className="px-3 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No team members in the database yet. Add the first one - the public Team page
            will use these instead of seed data.
          </p>
        )}
      </div>
    </div>
  );
}

function HofPanel({
  entries,
  onChange,
  setError,
}: {
  entries: HallOfFameRow[];
  onChange: () => Promise<void>;
  setError: (s: string | null) => void;
}) {
  const blank = {
    name: "",
    achievement: "",
    prize_usd: "100",
    date: "",
    project_url: "",
    description: "",
    sort_order: 0,
  };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEdit(e: HallOfFameRow) {
    setEditId(e.id);
    setForm({
      name: e.name,
      achievement: e.achievement,
      prize_usd: String(e.prize_usd),
      date: e.date,
      project_url: e.project_url || "",
      description: e.description || "",
      sort_order: e.sort_order ?? 0,
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(blank);
  }

  async function save(ev: FormEvent) {
    ev.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hall-of-fame", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId || undefined,
          name: form.name,
          achievement: form.achievement,
          prize_usd: Number(form.prize_usd),
          date: form.date,
          project_url: form.project_url || null,
          description: form.description || null,
          sort_order: Number(form.sort_order) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      cancelEdit();
      await onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this Hall of Fame entry?")) return;
    setError(null);
    const res = await fetch(`/api/admin/hall-of-fame?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Delete failed");
      return;
    }
    if (editId === id) cancelEdit();
    await onChange();
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <form onSubmit={save} className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6 lg:col-span-2 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {editId ? "Edit entry" : "Add entry"}
        </h2>
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
        <Field
          label="Achievement"
          value={form.achievement}
          onChange={(v) => setForm((f) => ({ ...f, achievement: v }))}
          required
        />
        <Field
          label="Prize USD (≥ 100)"
          value={form.prize_usd}
          onChange={(v) => setForm((f) => ({ ...f, prize_usd: v }))}
          inputMode="decimal"
          required
        />
        <Field
          label="Date"
          value={form.date}
          onChange={(v) => setForm((f) => ({ ...f, date: v }))}
          placeholder="2025-11"
          required
        />
        <Field
          label="Project URL"
          value={form.project_url}
          onChange={(v) => setForm((f) => ({ ...f, project_url: v }))}
        />
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[96px]"
            rows={3}
          />
        </label>
        <div className="flex flex-wrap gap-2 pt-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {saving ? "Saving…" : editId ? "Update" : "Add entry"}
          </button>
          {editId && (
            <button type="button" onClick={cancelEdit} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3 lg:col-span-3">
        {entries.map((e) => (
          <div
            key={e.id}
            className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{e.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{e.achievement}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                ${Number(e.prize_usd).toLocaleString()} · {e.date}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(e)} className="px-3 py-2 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-1">
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(e.id)}
                className="px-3 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No Hall of Fame entries in the database yet. Add wins of $100+ prize value.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal";
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}
