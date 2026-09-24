import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tiefes Petrol/Teal statt Gras-/Recycling-Grün.
        primary: {
          DEFAULT: "#0B6E76",
          dark: "#085458",
          deep: "#05393C",
        },
        // Warmes Gold statt Mintgrün als Hauptakzent – zusammen mit Teal
        // und Terracotta ein hochwertigeres, appetitlicheres Farbtrio.
        accent: {
          DEFAULT: "#E3A73E",
          dark: "#B9822B",
          light: "#F3C876",
        },
        // Terracotta als dritter, wärmender Ton.
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
        card: "0 1px 2px rgba(11, 110, 118, 0.06), 0 8px 24px -12px rgba(11, 110, 118, 0.18)",
        "card-hover": "0 4px 10px rgba(11, 110, 118, 0.08), 0 16px 32px -12px rgba(11, 110, 118, 0.26)",
      },
    },
  },
  plugins: [],
};

export default config;
