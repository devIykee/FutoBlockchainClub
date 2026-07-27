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
        "glow-lg": "0 0 28px rgba(0, 229, 255, 0.28)",
      },
      spacing: {
        "page-x": "16px",
        "page-x-md": "40px",
      },
    },
  },
  plugins: [],
};
export default config;
