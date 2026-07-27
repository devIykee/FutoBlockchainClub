import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";
import { ADMIN_COOKIE_NAME } from "./constants";

function hashToken(password: string): string {
  return createHash("sha256").update(`fbc-admin:${password}`).digest("hex");
}

export function getExpectedAdminToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return hashToken(password);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isAdminAuthenticated(): boolean {
  const expected = getExpectedAdminToken();
  if (!expected) return false;
  const cookie = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!cookie) return false;
  try {
    const a = Buffer.from(cookie);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function adminSessionValue(): string {
  const token = getExpectedAdminToken();
  if (!token) throw new Error("ADMIN_PASSWORD is not configured");
  return token;
}
