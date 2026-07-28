/** Normalize social handles for uniqueness / comparison. */
export function normalizeHandle(input: string): string {
  return input
    .trim()
    .replace(/^@+/, "")
    .toLowerCase()
    .replace(/\s+/g, "");
}

export function isValidHandle(input: string): boolean {
  const h = normalizeHandle(input);
  // 3–32 chars, letters numbers underscore period
  return /^[a-z0-9_.]{3,32}$/i.test(h);
}
