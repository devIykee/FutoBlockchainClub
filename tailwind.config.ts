import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "var(--bg)",
          deep: "var(--bg-deep)",
          surface: "var(--bg-surface)",
          card: "var(--bg-card)",
          elevated: "var(--bg-elevated)",
          high: "var(--bg-high)",
          highest: "var(--bg-highest)",
        },
        cyan: {
          DEFAULT: "var(--cyan)",
          soft: "var(--cyan-soft)",
          dim: "var(--cyan-dim)",
          deep: "var(--cyan-deep)",
        },
        brand: {
          DEFAULT: "var(--brand)",
          deep: "var(--brand-deep)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
          dim: "var(--ink-dim)",
        },
        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },
        indigo: {
          soft: "var(--indigo-soft)",
          deep: "var(--indigo-deep)",
          muted: "var(--indigo-muted)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          soft: "var(--danger-soft)",
          border: "var(--danger-border)",
        },
        success: {
          DEFAULT: "var(--success)",
          soft: "var(--success-soft)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          soft: "var(--gold-soft)",
          border: "var(--gold-border)",
          deep: "var(--gold-deep)",
        },
      },
      fontFamily: {
        display: ["var(--font-hanken)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        btn: "12px",
        card: "16px",
        panel: "24px",
      },
      maxWidth: {
        container: "1200px",
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        "glow-sm": "var(--shadow-glow)",
        "glow-gold": "0 0 15px color-mix(in srgb, var(--gold) 20%, transparent)",
      },
      spacing: {
        "page-x": "16px",
        "page-x-md": "40px",
        section: "64px",
        "section-md": "80px",
      },
      keyframes: {
        "rank-up": {
          "0%": { backgroundColor: "color-mix(in srgb, var(--cyan) 22%, transparent)" },
          "100%": { backgroundColor: "transparent" },
        },
        "rank-slide": {
          "0%": { transform: "translateY(6px)", opacity: "0.6" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "live-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
      },
      animation: {
        "rank-up": "rank-up 1.2s ease-out",
        "rank-slide": "rank-slide 0.45s ease-out",
        "live-pulse": "live-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
