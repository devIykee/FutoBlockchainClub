/** Public community links — overridable via env at build time. */

export const SOCIAL_LINKS = {
  ledgerTelegram:
    process.env.NEXT_PUBLIC_LEDGER_TG_LINK ||
    "https://t.me/+_KIs8nMAL6s2ZDQx",
  fbcTelegram:
    process.env.NEXT_PUBLIC_FBC_TG_LINK || "https://t.me/+CwRVCVVN3J9mNjE0",
  fbcX:
    process.env.NEXT_PUBLIC_FBC_X_LINK || "https://x.com/BlockchainFUTO",
  fbcWhatsApp:
    process.env.NEXT_PUBLIC_FBC_WA_LINK ||
    "https://chat.whatsapp.com/DrEasofyaZt23doh7ou5eW?s=cl&p=a&ilr=0",
} as const;
