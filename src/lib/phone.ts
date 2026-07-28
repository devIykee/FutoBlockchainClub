/**
 * Normalize Nigerian (and common) phone numbers to E.164-ish digits: +234...
 * Returns null if invalid.
 */
export function normalizePhone(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  // Keep leading + for detection, strip other non-digits
  const hasPlus = raw.startsWith("+");
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  // Local formats: 0803..., 0703..., 090..., 081...
  if (digits.startsWith("0") && digits.length === 11) {
    digits = "234" + digits.slice(1);
  }
  // 803... (10 digits without leading 0)
  if (!digits.startsWith("234") && digits.length === 10 && /^[789]/.test(digits)) {
    digits = "234" + digits;
  }
  // Already 234...
  if (digits.startsWith("234") && digits.length === 13) {
    return `+${digits}`;
  }
  // International with country code already (other countries: 10–15 digits total)
  if (hasPlus && digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }
  // Bare international without + (e.g. 234801...)
  if (digits.startsWith("234") && digits.length >= 12 && digits.length <= 15) {
    return `+${digits}`;
  }

  return null;
}

export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null;
}

/** Display-friendly: +234 801 234 5678 */
export function formatPhoneDisplay(e164: string): string {
  const d = e164.replace(/\D/g, "");
  if (d.startsWith("234") && d.length === 13) {
    return `+234 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
  }
  return e164;
}
