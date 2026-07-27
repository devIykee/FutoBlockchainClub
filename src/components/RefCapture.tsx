"use client";

import { useEffect } from "react";
import { REF_COOKIE_NAME, REF_STORAGE_KEY } from "@/lib/constants";

/**
 * Captures ?ref=CODE from any page URL into localStorage + a short-lived cookie
 * so the code survives navigation to /ledger-contest/signup.
 */
export function RefCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("ref")?.trim();
      if (!code) return;

      localStorage.setItem(REF_STORAGE_KEY, code);
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `${REF_COOKIE_NAME}=${encodeURIComponent(code)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    } catch {
      // ignore storage errors
    }
  }, []);

  return null;
}

export function readStoredRef(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const fromLs = localStorage.getItem(REF_STORAGE_KEY);
    if (fromLs) return fromLs;
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${REF_COOKIE_NAME}=`));
    if (match) return decodeURIComponent(match.split("=")[1] || "");
  } catch {
    // ignore
  }
  return null;
}
