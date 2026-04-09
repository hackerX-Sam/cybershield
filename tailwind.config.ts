import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        neon: {
          cyan: "oklch(0.8 0.15 190)",
          green: "oklch(0.75 0.2 145)",
          red: "oklch(0.65 0.25 25)",
          orange: "oklch(0.75 0.2 55)",
        },
      },
      animation: {
        "radar-scan": "radar-scan 3s linear infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        "scan-line": "scan-line 2s ease-in-out infinite",
      },
      keyframes: {
        "radar-scan": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.5)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "scan-line": {
          "0%": { top: "0", opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
}

export default config
