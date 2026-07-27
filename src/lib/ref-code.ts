import { customAlphabet } from "nanoid";

/** Alphanumeric, no ambiguous chars (0/O, 1/l/I). */
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
const generate = customAlphabet(alphabet, 7);

export function generateRefCode(): string {
  return generate();
}
