"use client";

import { useEffect, useState } from "react";
import { CONTEST_END } from "@/lib/constants";

type Parts = { d: number; h: number; m: number; s: number };

function getParts(end: Date): Parts {
  const diff = Math.max(0, end.getTime() - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Countdown({ compact = false }: { compact?: boolean }) {
  const [parts, setParts] = useState<Parts | null>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const tick = () => {
      const p = getParts(CONTEST_END);
      setParts(p);
      setEnded(p.d === 0 && p.h === 0 && p.m === 0 && p.s === 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!parts) {
    return <div className="label-caps text-ink-dim">Loading countdown…</div>;
  }

  if (ended) {
    return (
      <div className="font-sans text-sm font-medium uppercase tracking-wider text-red-300">
        Contest closed
      </div>
    );
  }

  const units = [
    { label: "D", value: parts.d },
    { label: "H", value: parts.h },
    { label: "M", value: parts.m },
    { label: "S", value: parts.s },
  ];

  if (compact) {
    return (
      <div className="flex flex-col gap-1">
        <span className="label-caps">Ends in</span>
        <div className="flex gap-3 font-display text-2xl font-bold text-cyan">
          {units.map((u) => (
            <div key={u.label}>
              {pad(u.value)}
              <span className="ml-0.5 text-xs font-sans font-medium text-ink-muted">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col gap-2 rounded-card border border-white/10 bg-bg-card px-5 py-4">
      <span className="label-caps">Contest ends August 1</span>
      <div className="flex gap-4 font-display text-3xl font-bold text-cyan md:text-4xl">
        {units.map((u) => (
          <div key={u.label} className="flex min-w-[3rem] flex-col items-center">
            <span>{pad(u.value)}</span>
            <span className="label-caps mt-1">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
