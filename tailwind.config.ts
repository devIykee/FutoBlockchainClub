import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0A0C10",
          deep: "#0c0e12",
          surface: "#111318",
          card: "#1a1c20",
          elevated: "#1e2024",
          high: "#282a2e",
          highest: "#333539",
        },
        cyan: {
          DEFAULT: "#00E5FF",
          soft: "#c3f5ff",
          dim: "#00daf3",
          deep: "#00363d",
        },
        /** Brand blue from FBC logo mark */
        brand: {
          DEFAULT: "#0038EC",
          deep: "#0028a8",
        },
        ink: {
          DEFAULT: "#e2e2e8",
          muted: "#bac9cc",
          dim: "#849396",
        },
        outline: {
          DEFAULT: "#849396",
          variant: "#3b494c",
        },
        indigo: {
          soft: "#bdc2ff",
          deep: "#343d96",
          muted: "#2a2f4a",
        },
        /** Semantic tokens — palette-bound only */
        danger: {
          DEFAULT: "#ffb4ab",
          soft: "rgba(255, 180, 171, 0.12)",
          border: "rgba(255, 180, 171, 0.35)",
        },
        success: {
          DEFAULT: "#00E5FF",
          soft: "rgba(0, 229, 255, 0.12)",
        },
        /** Warm secondary for Hall of Fame achievement framing */
        gold: {
          DEFAULT: "#e8c47c",
          soft: "rgba(232, 196, 124, 0.12)",
          border: "rgba(232, 196, 124, 0.35)",
          deep: "#3d3420",
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
        glow: "0 0 15px rgba(0, 229, 255, 0.2)",
        "glow-sm": "0 0 8px rgba(0, 229, 255, 0.15)",
        "glow-gold": "0 0 15px rgba(232, 196, 124, 0.18)",
      },
      spacing: {
        "page-x": "16px",
        "page-x-md": "40px",
        section: "64px",
        "section-md": "80px",
      },
      keyframes: {
        "rank-up": {
          "0%": { backgroundColor: "rgba(0, 229, 255, 0.22)" },
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
