"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Download, LogOut, Plus, RefreshCw, Trash2, Pencil } from "lucide-react";
import type { HallOfFameRow, Signup, TeamMemberRow } from "@/lib/types";
import { LEVELS, NICHES } from "@/lib/constants";
import { ImageUploadField } from "@/components/ImageUploadField";
import { AdminReferralsPanel } from "@/components/AdminReferralsPanel";

type Tab = "signups" | "referrals" | "team" | "hof";

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
    const res = await fetch("/api/admin/signups", { cache: "no-store" });
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
        fetch("/api/admin/signups", { cache: "no-store" }),
        fetch("/api/admin/team", { cache: "no-store" }),
        fetch("/api/admin/hall-of-fame", { cache: "no-store" }),
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
      "phone",
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
          <p className="label-caps">Secure access</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">Admin</h1>
          <p className="mt-2 text-base leading-relaxed text-ink">
            Enter the admin password to manage contest signups, team, and Hall of Fame.
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

  const tabs: { id: Tab; label: string }[] = [
    { id: "signups", label: `Signups (${signups.length})` },
    { id: "referrals", label: "Referrals" },
    { id: "team", label: `Team (${team.length})` },
    { id: "hof", label: `Hall of Fame (${hof.length})` },
  ];

  return (
    <div className="mx-auto w-full max-w-container page-pad py-10 md:py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="label-caps">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadAll}
            disabled={refreshing}
            className="btn-secondary"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          {tab === "signups" && (
            <button type="button" onClick={exportCsv} className="btn-secondary">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
          <button type="button" onClick={logout} className="btn-secondary">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-btn px-4 py-2 text-sm font-medium min-h-[44px] transition-colors ${
              tab === t.id
                ? "bg-cyan/15 text-cyan"
                : "text-ink-muted hover:bg-white/5 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loadError && <p className="mb-4 alert-danger">{loadError}</p>}

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
      {tab === "referrals" && (
        <AdminReferralsPanel setError={setLoadError} />
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
                "Phone",
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
              <tr key={r.id} className="border-b border-white/5 text-ink hover:bg-bg-high">
                <td className="px-3 py-3 whitespace-nowrap font-medium">{r.full_name}</td>
                <td className="px-3 py-3 whitespace-nowrap">{r.department}</td>
                <td className="px-3 py-3">{r.level}</td>
                <td className="px-3 py-3 whitespace-nowrap">{r.niche}</td>
                <td className="px-3 py-3">{r.skill_level}</td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">{r.phone || "—"}</td>
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
                <td colSpan={11} className="px-3 py-10 text-center text-ink-muted">
                  No signups match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {filtered.map((r) => (
          <div key={r.id} className="card-surface space-y-2 !p-4 text-sm">
            <p className="font-display text-lg font-semibold text-ink">{r.full_name}</p>
            <p className="text-ink-muted">
              {r.department} · Level {r.level} · {r.niche}
            </p>
            <p className="text-xs text-ink-dim">{r.phone || "No phone"}</p>
            <p className="text-xs text-ink-dim">
              @{r.x_handle} · TG @{r.telegram_username}
            </p>
            <p className="text-cyan">
              ref: {r.ref_code}
              {r.referred_by ? ` · by ${r.referred_by}` : ""}
            </p>
            <p className="text-xs text-ink-dim">
              {new Date(r.created_at).toLocaleString()}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-muted">
            No signups match the current filters.
          </p>
        )}
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
      <form onSubmit={save} className="card-surface lg:col-span-2 space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink">
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
        <ImageUploadField
          label="Photo"
          value={form.photo}
          onChange={(v) => setForm((f) => ({ ...f, photo: v }))}
          folder="team"
          disabled={saving}
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
          <button type="submit" disabled={saving} className="btn-primary">
            <Plus className="h-4 w-4" />
            {saving ? "Saving…" : editId ? "Update" : "Add member"}
          </button>
          {editId && (
            <button type="button" onClick={cancelEdit} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3 lg:col-span-3">
        {members.map((m) => (
          <div
            key={m.id}
            className="card-surface !p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-high text-xs font-bold text-ink ring-1 ring-theme">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  m.name
                    .split(/\s+/)
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold text-ink truncate">{m.name}</p>
                <p className="text-sm text-ink-muted truncate">{m.role}</p>
                <p className="mt-1 text-xs text-ink-dim">
                  order {m.sort_order}
                  {m.x ? " · X" : ""}
                  {m.github ? " · GH" : ""}
                  {m.linkedin ? " · LI" : ""}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(m)} className="btn-secondary !px-3">
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(m.id)}
                className="btn-secondary !px-3 text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-sm text-ink-muted">
            No team members yet. Add people here — the public Team page shows only what
            you save (no demo placeholders).
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
      <form onSubmit={save} className="card-surface lg:col-span-2 space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink">
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
          <span className="label-caps">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="field-input min-h-[96px]"
            rows={3}
          />
        </label>
        <div className="flex flex-wrap gap-2 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            <Plus className="h-4 w-4" />
            {saving ? "Saving…" : editId ? "Update" : "Add entry"}
          </button>
          {editId && (
            <button type="button" onClick={cancelEdit} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3 lg:col-span-3">
        {entries.map((e) => (
          <div
            key={e.id}
            className="card-surface !p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display font-semibold text-ink">{e.name}</p>
              <p className="text-sm text-ink-muted">{e.achievement}</p>
              <p className="mt-1 text-xs text-ink-dim">
                ${Number(e.prize_usd).toLocaleString()} · {e.date}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(e)} className="btn-secondary !px-3">
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(e.id)}
                className="btn-secondary !px-3 text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-ink-muted">
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
      <span className="label-caps">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        className="field-input"
      />
    </label>
  );
}
