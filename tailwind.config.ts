import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F6E56",
          dark: "#0B5643",
          deep: "#073B2E",
        },
        accent: {
          DEFAULT: "#5DCAA5",
        },
        // Warmer Zweitakzent (Terracotta), um das Grün aufzubrechen und
        // die Fläche weniger "einfarbig/steril" wirken zu lassen.
        warm: {
          DEFAULT: "#C1653F",
          dark: "#9C4F31",
          light: "#E8A377",
        },
        background: "#FAFAF8",
        foreground: "#2C2C2A",
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "10px",
        sm: "8px",
        lg: "12px",
      },
      maxWidth: {
        container: "1200px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 110, 86, 0.06), 0 8px 24px -12px rgba(15, 110, 86, 0.18)",
        "card-hover": "0 4px 10px rgba(15, 110, 86, 0.08), 0 16px 32px -12px rgba(15, 110, 86, 0.26)",
      },
    },
  },
  plugins: [],
};

export default config;
