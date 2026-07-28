"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  AlertTriangle,
  RefreshCw,
  ScrollText,
  ShieldX,
  UserX,
  XCircle,
} from "lucide-react";
import type { AdminAuditEntry, Signup } from "@/lib/types";
import { statusLabel } from "@/lib/referral-status";

type ReferralTotals = {
  active: number;
  verified: number;
  pending: number;
  rejected: number;
  countable: number;
};

type UserRow = Signup & {
  inbound_status?: string | null;
  referral_totals: ReferralTotals;
  flags?: {
    has_pending_outbound?: boolean;
    high_pending?: boolean;
    self_ref_possible?: boolean;
  };
};

type ProfilePayload = {
  user: Signup;
  referrer: Signup | null;
  referrals: Signup[];
  formerly_referred: Signup[];
  totals: ReferralTotals & { removed_history: number };
  audit: AdminAuditEntry[];
};

type Props = {
  setError: (s: string | null) => void;
};

export function AdminReferralsPanel({ setError }: Props) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [audit, setAudit] = useState<AdminAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortKey, setSortKey] = useState<"created_at" | "referrals" | "name">(
    "created_at"
  );
  const [showAudit, setShowAudit] = useState(false);

  // Moderation form
  const [actionTarget, setActionTarget] = useState<Signup | null>(null);
  const [actionType, setActionType] = useState<"verify" | "reject" | "remove">(
    "verify"
  );
  const [reason, setReason] = useState("");
  const [acting, setActing] = useState(false);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [uRes, aRes] = await Promise.all([
        fetch("/api/admin/referrals", { cache: "no-store" }),
        fetch("/api/admin/audit-log?limit=100", { cache: "no-store" }),
      ]);
      if (!uRes.ok) {
        const d = await uRes.json().catch(() => ({}));
        throw new Error(d.error || "Failed to load referrals");
      }
      const ud = await uRes.json();
      setUsers(ud.users || []);
      if (aRes.ok) {
        const ad = await aRes.json();
        setAudit(ad.entries || []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load referrals");
    } finally {
      setLoading(false);
    }
  }, [setError]);

  const loadProfile = useCallback(
    async (id: string) => {
      setProfileLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/referrals/${encodeURIComponent(id)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profile");
        setProfile(data as ProfilePayload);
        setProfileId(id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        setProfileLoading(false);
      }
    },
    [setError]
  );

  useEffect(() => {
    loadList();
  }, [loadList]);

  const filtered = useMemo(() => {
    let rows = [...users];
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      rows = rows.filter(
        (u) =>
          u.full_name.toLowerCase().includes(s) ||
          u.ref_code.toLowerCase().includes(s) ||
          (u.phone || "").toLowerCase().includes(s) ||
          (u.x_handle || "").toLowerCase().includes(s) ||
          (u.telegram_username || "").toLowerCase().includes(s) ||
          (u.department || "").toLowerCase().includes(s)
      );
    }
    if (statusFilter === "organic") {
      rows = rows.filter((u) => !u.referred_by);
    } else if (statusFilter === "pending_in") {
      rows = rows.filter(
        (u) => u.referred_by && (u.referral_status === "pending" || !u.referral_status)
      );
    } else if (statusFilter === "verified_in") {
      rows = rows.filter((u) => u.referral_status === "verified");
    } else if (statusFilter === "rejected_in") {
      rows = rows.filter((u) => u.referral_status === "rejected");
    } else if (statusFilter === "has_pending_out") {
      rows = rows.filter((u) => (u.referral_totals?.pending || 0) > 0);
    } else if (statusFilter === "suspicious") {
      rows = rows.filter(
        (u) => u.flags?.high_pending || u.flags?.self_ref_possible
      );
    }

    rows.sort((a, b) => {
      if (sortKey === "name") return a.full_name.localeCompare(b.full_name);
      if (sortKey === "referrals") {
        return (
          (b.referral_totals?.countable || 0) -
          (a.referral_totals?.countable || 0)
        );
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    return rows;
  }, [users, q, statusFilter, sortKey]);

  async function submitAction(e: FormEvent) {
    e.preventDefault();
    if (!actionTarget) return;
    setActing(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/referrals/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signup_id: actionTarget.id,
          action: actionType,
          reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      setActionTarget(null);
      setReason("");
      await loadList();
      if (profileId) await loadProfile(profileId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActing(false);
    }
  }

  function openAction(user: Signup, type: "verify" | "reject" | "remove") {
    setActionTarget(user);
    setActionType(type);
    setReason("");
  }

  if (profileId && profile) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setProfileId(null);
              setProfile(null);
            }}
            className="btn-secondary !px-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </button>
          <button
            type="button"
            onClick={() => loadProfile(profileId)}
            disabled={profileLoading}
            className="btn-secondary !px-3"
          >
            <RefreshCw
              className={`h-4 w-4 ${profileLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        <ProfileView
          data={profile}
          onOpenUser={(id) => loadProfile(id)}
          onAction={openAction}
        />

        {actionTarget && (
          <ActionModal
            target={actionTarget}
            actionType={actionType}
            reason={reason}
            setReason={setReason}
            acting={acting}
            onClose={() => setActionTarget(null)}
            onSubmit={submitAction}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            Referral management
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Review users, inspect referrer ↔ referred pairs, and verify / reject /
            remove credits. Only <strong className="text-ink">verified</strong>{" "}
            referrals count on the leaderboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowAudit((v) => !v)}
            className="btn-secondary !px-3"
          >
            <ScrollText className="h-4 w-4" />
            {showAudit ? "Hide audit log" : "Audit log"}
          </button>
          <button
            type="button"
            onClick={loadList}
            disabled={loading}
            className="btn-secondary !px-3"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {showAudit && (
        <AuditTable entries={audit} onOpenUser={(id) => id && loadProfile(id)} />
      )}

      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone, handle, ref…"
          className="field-input min-w-[200px] flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="field-input w-auto min-w-[160px]"
        >
          <option value="">All users</option>
          <option value="pending_in">Inbound: pending</option>
          <option value="verified_in">Inbound: verified</option>
          <option value="rejected_in">Inbound: rejected</option>
          <option value="organic">Organic (no referrer)</option>
          <option value="has_pending_out">Has pending outbound</option>
          <option value="suspicious">Suspicious flags</option>
        </select>
        <select
          value={sortKey}
          onChange={(e) =>
            setSortKey(e.target.value as "created_at" | "referrals" | "name")
          }
          className="field-input w-auto min-w-[140px]"
        >
          <option value="created_at">Sort: newest</option>
          <option value="referrals">Sort: verified refs</option>
          <option value="name">Sort: name</option>
        </select>
      </div>

      {loading && (
        <p className="text-sm text-ink-muted">Loading users…</p>
      )}

      <div className="hidden overflow-x-auto rounded-card border border-theme md:block">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-theme bg-bg-card label-caps">
              {[
                "Name",
                "Joined",
                "Inbound status",
                "Referrals (V/P/R)",
                "Flags",
                "",
              ].map((h) => (
                <th key={h || "act"} className="px-3 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.id}
                className="border-b border-theme/60 text-ink hover:bg-bg-high cursor-pointer"
                onClick={() => loadProfile(u.id)}
              >
                <td className="px-3 py-3">
                  <p className="font-medium">{u.full_name}</p>
                  <p className="text-xs text-ink-dim">
                    {u.ref_code} · @{u.x_handle}
                  </p>
                </td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">
                  {new Date(u.created_at).toLocaleString()}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge
                    status={
                      u.referred_by
                        ? u.referral_status || "pending"
                        : null
                    }
                  />
                  {u.referred_by && (
                    <p className="mt-1 text-xs text-ink-dim">
                      via {u.referred_by}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3 tabular-nums text-xs">
                  <span className="text-cyan font-semibold">
                    {u.referral_totals?.countable ?? 0}
                  </span>
                  {" verified · "}
                  {u.referral_totals?.pending ?? 0} pend ·{" "}
                  {u.referral_totals?.rejected ?? 0} rej
                </td>
                <td className="px-3 py-3">
                  <Flags flags={u.flags} />
                </td>
                <td className="px-3 py-3 text-right">
                  <ChevronRight className="inline h-4 w-4 text-ink-dim" />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-10 text-center text-ink-muted"
                >
                  No users match filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {filtered.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => loadProfile(u.id)}
            className="card-surface !p-4 w-full text-left space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display font-semibold text-ink">
                  {u.full_name}
                </p>
                <p className="text-xs text-ink-dim">{u.ref_code}</p>
              </div>
              <StatusBadge
                status={
                  u.referred_by ? u.referral_status || "pending" : null
                }
              />
            </div>
            <p className="text-xs text-ink-muted">
              Joined {new Date(u.created_at).toLocaleDateString()} ·{" "}
              {u.referral_totals?.countable ?? 0} verified refs
            </p>
            <Flags flags={u.flags} />
          </button>
        ))}
      </div>

      {actionTarget && (
        <ActionModal
          target={actionTarget}
          actionType={actionType}
          reason={reason}
          setReason={setReason}
          acting={acting}
          onClose={() => setActionTarget(null)}
          onSubmit={submitAction}
        />
      )}
    </div>
  );
}

function ProfileView({
  data,
  onOpenUser,
  onAction,
}: {
  data: ProfilePayload;
  onOpenUser: (id: string) => void;
  onAction: (u: Signup, t: "verify" | "reject" | "remove") => void;
}) {
  const { user, referrer, referrals, formerly_referred, totals, audit } = data;

  return (
    <div className="space-y-6">
      <div className="card-surface space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="label-caps">Full profile</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink">
              {user.full_name}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Ref <span className="text-cyan font-mono">{user.ref_code}</span>
              {" · "}
              Joined {new Date(user.created_at).toLocaleString()}
            </p>
          </div>
          <StatusBadge
            status={
              user.referred_by
                ? user.referral_status || "pending"
                : user.referral_status === "removed"
                  ? "removed"
                  : null
            }
          />
        </div>

        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <Fact label="Phone" value={user.phone || "—"} />
          <Fact label="Department" value={user.department} />
          <Fact label="Level" value={user.level} />
          <Fact label="Niche" value={user.niche} />
          <Fact label="Skill" value={user.skill_level} />
          <Fact label="X" value={`@${user.x_handle}`} />
          <Fact label="Telegram" value={`@${user.telegram_username}`} />
          <Fact
            label="Source"
            value={user.referral_source || (user.referred_by ? "referral_link" : "organic")}
          />
          <Fact
            label="Social verify"
            value={[
              user.joined_ledger ? "Ledger" : null,
              user.joined_fbc ? "FBC" : null,
              user.followed_x ? "X" : null,
            ]
              .filter(Boolean)
              .join(", ") || "—"}
          />
          {user.referral_reviewed_at && (
            <Fact
              label="Reviewed"
              value={`${user.referral_reviewed_by || "admin"} · ${new Date(user.referral_reviewed_at).toLocaleString()}`}
            />
          )}
          {user.referral_review_reason && (
            <Fact label="Review reason" value={user.referral_review_reason} />
          )}
        </dl>

        {user.referred_by && (
          <div className="flex flex-wrap gap-2 border-t border-theme pt-4">
            <button
              type="button"
              className="btn-primary !px-3 text-sm"
              onClick={() => onAction(user, "verify")}
            >
              <CheckCircle2 className="h-4 w-4" />
              Verify referral
            </button>
            <button
              type="button"
              className="btn-secondary !px-3 text-sm"
              onClick={() => onAction(user, "reject")}
            >
              <XCircle className="h-4 w-4" />
              Reject referral
            </button>
            <button
              type="button"
              className="btn-secondary !px-3 text-sm text-danger"
              onClick={() => onAction(user, "remove")}
            >
              <UserX className="h-4 w-4" />
              Remove referral
            </button>
          </div>
        )}
      </div>

      {/* Side-by-side comparison when referred */}
      {(referrer || user.previous_referred_by) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="card-surface !p-4 space-y-2">
            <p className="label-caps text-cyan">Referrer</p>
            {referrer ? (
              <>
                <button
                  type="button"
                  onClick={() => onOpenUser(referrer.id)}
                  className="text-left font-display text-lg font-semibold text-ink hover:text-cyan"
                >
                  {referrer.full_name}{" "}
                  <ChevronRight className="inline h-4 w-4" />
                </button>
                <CompareBlock user={referrer} />
              </>
            ) : (
              <p className="text-sm text-ink-muted">
                Previous code: {user.previous_referred_by} (profile missing)
              </p>
            )}
          </div>
          <div className="card-surface !p-4 space-y-2">
            <p className="label-caps">Referred user (this profile)</p>
            <p className="font-display text-lg font-semibold text-ink">
              {user.full_name}
            </p>
            <CompareBlock user={user} />
            {referrer && <SuspicionHints a={referrer} b={user} />}
          </div>
        </div>
      )}

      <div className="card-surface space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="label-caps">People they referred</p>
            <p className="mt-1 text-sm text-ink-muted">
              {totals.verified} verified · {totals.pending} pending ·{" "}
              {totals.rejected} rejected · {totals.countable} countable for
              rewards
            </p>
          </div>
        </div>
        {referrals.length === 0 ? (
          <p className="text-sm text-ink-muted">No active referrals yet.</p>
        ) : (
          <ul className="space-y-2">
            {referrals.map((r) => (
              <li
                key={r.id}
                className="rounded-btn border border-theme bg-bg-high/40 px-3 py-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenUser(r.id)}
                    className="text-left"
                  >
                    <p className="font-medium text-ink hover:text-cyan">
                      {r.full_name}
                    </p>
                    <p className="text-xs text-ink-dim">
                      {new Date(r.created_at).toLocaleString()}
                      {" · "}
                      source {r.referral_source || "referral_link"}
                      {" · "}
                      {r.department} · L{r.level}
                    </p>
                  </button>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={r.referral_status || "pending"} />
                    <button
                      type="button"
                      className="btn-secondary !px-2 !py-1 text-xs"
                      onClick={() => onAction(r, "verify")}
                    >
                      Verify
                    </button>
                    <button
                      type="button"
                      className="btn-secondary !px-2 !py-1 text-xs"
                      onClick={() => onAction(r, "reject")}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="btn-secondary !px-2 !py-1 text-xs text-danger"
                      onClick={() => onAction(r, "remove")}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {formerly_referred.length > 0 && (
          <div className="border-t border-theme pt-3">
            <p className="label-caps mb-2">Removed credits (history)</p>
            <ul className="space-y-1 text-sm text-ink-muted">
              {formerly_referred.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => onOpenUser(r.id)}
                    className="hover:text-cyan"
                  >
                    {r.full_name}
                  </button>
                  {" · "}
                  {r.referral_review_reason || "no reason"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {audit.length > 0 && (
        <div className="card-surface space-y-2">
          <p className="label-caps">Audit (this user)</p>
          <AuditTable entries={audit} onOpenUser={onOpenUser} compact />
        </div>
      )}
    </div>
  );
}

function CompareBlock({ user }: { user: Signup }) {
  return (
    <dl className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
      <Fact label="Phone" value={user.phone || "—"} />
      <Fact label="X" value={`@${user.x_handle}`} />
      <Fact label="TG" value={`@${user.telegram_username}`} />
      <Fact label="Dept" value={user.department} />
      <Fact label="Level" value={user.level} />
      <Fact label="Joined" value={new Date(user.created_at).toLocaleString()} />
    </dl>
  );
}

function SuspicionHints({ a, b }: { a: Signup; b: Signup }) {
  const hints: string[] = [];
  if (a.phone && b.phone && a.phone === b.phone) {
    hints.push("Same phone number");
  }
  if (
    a.x_handle &&
    b.x_handle &&
    a.x_handle.toLowerCase() === b.x_handle.toLowerCase()
  ) {
    hints.push("Same X handle");
  }
  if (
    a.telegram_username &&
    b.telegram_username &&
    a.telegram_username.toLowerCase() === b.telegram_username.toLowerCase()
  ) {
    hints.push("Same Telegram username");
  }
  const tA = new Date(a.created_at).getTime();
  const tB = new Date(b.created_at).getTime();
  if (Math.abs(tA - tB) < 5 * 60 * 1000) {
    hints.push("Signed up within 5 minutes of each other");
  }
  if (hints.length === 0) {
    return (
      <p className="mt-2 text-xs text-ink-dim">
        No automatic suspicion flags on this pair.
      </p>
    );
  }
  return (
    <div className="mt-2 rounded-btn border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
      <p className="font-semibold inline-flex items-center gap-1">
        <AlertTriangle className="h-3.5 w-3.5" />
        Possible issues
      </p>
      <ul className="mt-1 list-disc pl-4">
        {hints.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </div>
  );
}

function ActionModal({
  target,
  actionType,
  reason,
  setReason,
  acting,
  onClose,
  onSubmit,
}: {
  target: Signup;
  actionType: "verify" | "reject" | "remove";
  reason: string;
  setReason: (v: string) => void;
  acting: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}) {
  const titles = {
    verify: "Verify referral",
    reject: "Reject referral",
    remove: "Remove referral credit",
  };
  const hints = {
    verify:
      "This signup will count toward the referrer’s leaderboard / rewards.",
    reject:
      "Keeps the referrer link for inspection but does not count as a reward.",
    remove:
      "Clears referred_by so the referrer loses this credit immediately. Requires a reason.",
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <form
        onSubmit={onSubmit}
        className="card-surface w-full max-w-md space-y-4 shadow-xl"
      >
        <div>
          <p className="label-caps">{titles[actionType]}</p>
          <h3 className="mt-1 font-display text-lg font-semibold text-ink">
            {target.full_name}
          </h3>
          <p className="mt-1 text-xs text-ink-muted">{hints[actionType]}</p>
        </div>
        <label className="block space-y-1.5">
          <span className="label-caps">Reason (required)</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            minLength={3}
            rows={3}
            placeholder="e.g. Handles match real student · or · Duplicate SIM farm pattern"
            className="field-input min-h-[88px]"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={acting} className="btn-primary">
            {acting ? "Saving…" : "Confirm"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={acting}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function AuditTable({
  entries,
  onOpenUser,
  compact,
}: {
  entries: AdminAuditEntry[];
  onOpenUser: (id: string) => void;
  compact?: boolean;
}) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-ink-muted">No audit entries yet.</p>
    );
  }
  return (
    <div
      className={
        compact
          ? "space-y-2"
          : "overflow-x-auto rounded-card border border-theme"
      }
    >
      <table className="w-full min-w-[720px] text-left text-xs">
        {!compact && (
          <thead>
            <tr className="border-b border-theme bg-bg-card label-caps">
              {["When", "Admin", "Action", "Target", "Referrer", "Reason"].map(
                (h) => (
                  <th key={h} className="px-3 py-2">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
        )}
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b border-theme/50 text-ink">
              <td className="px-3 py-2 whitespace-nowrap">
                {new Date(e.created_at).toLocaleString()}
              </td>
              <td className="px-3 py-2">{e.admin_actor}</td>
              <td className="px-3 py-2 font-mono text-cyan">{e.action}</td>
              <td className="px-3 py-2">
                {e.target_signup_id ? (
                  <button
                    type="button"
                    className="hover:text-cyan underline-offset-2 hover:underline"
                    onClick={() => onOpenUser(e.target_signup_id!)}
                  >
                    {e.target_ref_code || e.target_signup_id.slice(0, 8)}
                  </button>
                ) : (
                  e.target_ref_code || "—"
                )}
              </td>
              <td className="px-3 py-2 font-mono">
                {e.referrer_ref_code || "—"}
              </td>
              <td className="px-3 py-2 max-w-[240px]">{e.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-theme px-2 py-0.5 text-[11px] font-medium text-ink-muted">
        Organic
      </span>
    );
  }
  const map: Record<
    string,
    { cls: string; icon: typeof Clock }
  > = {
    pending: {
      cls: "border-gold/40 bg-gold-soft text-gold",
      icon: Clock,
    },
    verified: {
      cls: "border-cyan/40 bg-cyan/15 text-cyan",
      icon: CheckCircle2,
    },
    rejected: {
      cls: "border-danger/40 bg-danger/10 text-danger",
      icon: ShieldX,
    },
    removed: {
      cls: "border-theme text-ink-dim",
      icon: UserX,
    },
  };
  const conf = map[status] || {
    cls: "border-theme text-ink-muted",
    icon: Clock,
  };
  const Icon = conf.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${conf.cls}`}
    >
      <Icon className="h-3 w-3" />
      {statusLabel(status)}
    </span>
  );
}

function Flags({
  flags,
}: {
  flags?: {
    has_pending_outbound?: boolean;
    high_pending?: boolean;
    self_ref_possible?: boolean;
  };
}) {
  if (!flags) return null;
  const items: string[] = [];
  if (flags.self_ref_possible) items.push("Self-ref?");
  if (flags.high_pending) items.push("Many pending");
  if (flags.has_pending_outbound && !flags.high_pending) items.push("Pending out");
  if (items.length === 0) {
    return <span className="text-xs text-ink-dim">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-0.5 rounded-full border border-danger/30 bg-danger/10 px-1.5 py-0.5 text-[10px] font-medium text-danger"
        >
          <AlertTriangle className="h-2.5 w-2.5" />
          {t}
        </span>
      ))}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-btn border border-theme bg-bg-high/50 px-2.5 py-1.5">
      <dt className="label-caps text-[10px]">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink break-words">{value}</dd>
    </div>
  );
}
