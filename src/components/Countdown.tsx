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
    return (
      <div className="font-mono text-xs uppercase tracking-widest text-ink-dim">
        Loading countdown…
      </div>
    );
  }

  if (ended) {
    return (
      <div className="font-mono text-sm uppercase tracking-widest text-accent-coral">
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
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-tighter text-ink-dim">
          Ends in
        </span>
        <div className="flex gap-3 font-display text-2xl font-bold text-electric-light">
          {units.map((u) => (
            <div key={u.label}>
              {pad(u.value)}
              <span className="ml-0.5 font-mono text-xs text-ink-dim">{u.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col gap-2 border border-outline-variant bg-navy-card px-5 py-4">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
        {"// Contest ends August 1"}
      </span>
      <div className="flex gap-4 font-display text-3xl font-bold text-electric-light md:text-4xl">
        {units.map((u) => (
          <div key={u.label} className="flex flex-col items-center min-w-[3rem]">
            <span>{pad(u.value)}</span>
            <span className="font-mono text-[10px] text-ink-dim tracking-widest">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
