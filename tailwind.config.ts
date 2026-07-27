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
        navy: {
          DEFAULT: "#0A0E1A",
          deep: "#0c0e17",
          surface: "#11131c",
          card: "#1a1b25",
          elevated: "#1e1f29",
          high: "#282933",
          highest: "#33343f",
        },
        electric: {
          DEFAULT: "#0038EC",
          light: "#bac3ff",
          soft: "#bdc5ff",
          dim: "#1d46f6",
        },
        ink: {
          DEFAULT: "#e2e1ef",
          muted: "#c4c5d9",
          dim: "#8e8fa2",
        },
        outline: {
          DEFAULT: "#8e8fa2",
          variant: "#444656",
        },
        accent: {
          coral: "#ffb4a5",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-archivo)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        container: "1280px",
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "64px",
        gutter: "24px",
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #0038EC",
        "hard-light": "4px 4px 0px 0px #bac3ff",
      },
    },
  },
  plugins: [],
};
export default config;
