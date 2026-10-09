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
        space: {
          darkest: "#030712",
          dark: "#0b1120",
          card: "#0f172a",
          border: "#1e293b",
        },
        combat: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          bright: "#60a5fa",
          neon: "#00f0ff",
          danger: "#ef4444",
          warning: "#f59e0b",
          success: "#10b981",
          purple: "#a855f7",
        },
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(59, 130, 246, 0.4)" },
          "100%": { boxShadow: "0 0 25px rgba(6, 182, 212, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
