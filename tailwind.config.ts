import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121419",
        card: {
          DEFAULT: "#202630",
          hover: "#262e3b",
          border: "#2d3545",
        },
        accent: {
          DEFAULT: "#E0A458",
          hover: "#ebb875",
          light: "#f5d4a4",
          dark: "#b87c2f",
          glow: "rgba(224, 164, 88, 0.25)",
        },
        surface: {
          primary: "#181d24",
          secondary: "#202630",
          tertiary: "#2a3240",
        },
        text: {
          primary: "#F5F5F5",
          secondary: "#A1A6AF",
          muted: "#6f7582",
        },
      },
      fontFamily: {
        sans: [
          "Space Grotesk",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        accent: "0 0 25px rgba(224, 164, 88, 0.2)",
        "accent-lg": "0 0 40px rgba(224, 164, 88, 0.35)",
        card: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};
export default config;

