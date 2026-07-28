"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  Hourglass,
  RefreshCw,
  Square,
  TimerReset,
} from "lucide-react";

type ContestState = {
  ends_at: string;
  is_open: boolean;
  ms_remaining: number;
  updated_at?: string | null;
  updated_by?: string | null;
};

type Props = {
  setError: (s: string | null) => void;
};

function formatRemaining(ms: number): string {
  if (ms <= 0) return "0d 0h 0m";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

/** datetime-local value in local timezone from ISO */
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AdminContestPanel({ setError }: Props) {
  const [contest, setContest] = useState<ContestState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [endsLocal, setEndsLocal] = useState("");
  const [extendDays, setExtendDays] = useState("3");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/contest", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load contest");
      setContest(data.contest);
      setEndsLocal(toLocalInputValue(data.contest.ends_at));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load contest");
    } finally {
      setLoading(false);
    }
  }, [setError]);

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  async function runAction(
    body: Record<string, unknown>,
    successMsg: string
  ) {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/contest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          reason: reason.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setContest(data.contest);
      setEndsLocal(toLocalInputValue(data.contest.ends_at));
      setMessage(successMsg);
      setReason("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  function onSetExact(e: FormEvent) {
    e.preventDefault();
    if (!endsLocal) return;
    const d = new Date(endsLocal);
    if (Number.isNaN(d.getTime())) {
      setError("Invalid date/time");
      return;
    }
    void runAction(
      { action: "set", ends_at: d.toISOString() },
      "Contest end time updated"
    );
  }

  function onExtendDays(e: FormEvent) {
    e.preventDefault();
    const days = Number(extendDays);
    if (!Number.isFinite(days) || days <= 0) {
      setError("Enter a positive number of days");
      return;
    }
    void runAction(
      { action: "extend_days", days },
      `Contest extended by ${days} day${days === 1 ? "" : "s"}`
    );
  }

  function onEndNow() {
    if (
      !confirm(
        "End the contest now? Signups will close and the countdown will show closed."
      )
    ) {
      return;
    }
    void runAction({ action: "end_now" }, "Contest ended");
  }

  if (loading && !contest) {
    return <p className="text-sm text-ink-muted">Loading contest settings…</p>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            Contest schedule
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            End the contest early or extend the deadline. Countdown and new
            signups follow this time automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading || saving}
          className="btn-secondary !px-3"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {contest && (
        <div className="card-surface space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                contest.is_open
                  ? "border-cyan/40 bg-cyan/15 text-cyan"
                  : "border-danger/40 bg-danger/10 text-danger"
              }`}
            >
              <Hourglass className="h-3.5 w-3.5" />
              {contest.is_open ? "Open" : "Closed"}
            </span>
            {contest.is_open && (
              <span className="text-sm text-ink-muted tabular-nums">
                {formatRemaining(contest.ms_remaining)} remaining
              </span>
            )}
          </div>
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
            <div className="rounded-btn border border-theme bg-bg-high/50 px-3 py-2">
              <dt className="label-caps text-[10px]">Ends at</dt>
              <dd className="mt-0.5 font-medium text-ink">
                {new Date(contest.ends_at).toLocaleString()}
              </dd>
            </div>
            <div className="rounded-btn border border-theme bg-bg-high/50 px-3 py-2">
              <dt className="label-caps text-[10px]">Last updated</dt>
              <dd className="mt-0.5 font-medium text-ink">
                {contest.updated_at
                  ? `${new Date(contest.updated_at).toLocaleString()}${
                      contest.updated_by ? ` · ${contest.updated_by}` : ""
                    }`
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {message && (
        <p className="rounded-btn border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm text-ink">
          {message}
        </p>
      )}

      <label className="block space-y-1.5">
        <span className="label-caps">Reason (optional, stored in audit log)</span>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Prize deadline extended for campus week"
          className="field-input"
          disabled={saving}
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form onSubmit={onSetExact} className="card-surface !p-4 space-y-3">
          <p className="label-caps inline-flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5" />
            Set end date &amp; time
          </p>
          <input
            type="datetime-local"
            value={endsLocal}
            onChange={(e) => setEndsLocal(e.target.value)}
            className="field-input"
            required
            disabled={saving}
          />
          <button type="submit" disabled={saving} className="btn-primary w-full">
            Save end time
          </button>
        </form>

        <form onSubmit={onExtendDays} className="card-surface !p-4 space-y-3">
          <p className="label-caps inline-flex items-center gap-1.5">
            <TimerReset className="h-3.5 w-3.5" />
            Extend by days
          </p>
          <input
            type="number"
            min={1}
            max={365}
            value={extendDays}
            onChange={(e) => setExtendDays(e.target.value)}
            className="field-input"
            disabled={saving}
          />
          <p className="text-xs text-ink-dim">
            Adds days from the current end (or from now if already closed).
          </p>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            Extend contest
          </button>
        </form>
      </div>

      <div className="card-surface !p-4 space-y-3 border-danger/20">
        <p className="label-caps text-danger inline-flex items-center gap-1.5">
          <Square className="h-3.5 w-3.5" />
          End contest now
        </p>
        <p className="text-sm text-ink-muted">
          Sets the end time to right now. New registrations will be blocked.
          You can still extend later if needed.
        </p>
        <button
          type="button"
          onClick={onEndNow}
          disabled={saving || (contest ? !contest.is_open : false)}
          className="btn-secondary w-full text-danger"
        >
          End contest immediately
        </button>
      </div>
    </div>
  );
}
