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
        background: "#0A0E1A",
        surface: "#141928",
        elevated: "#1E2640",
        border: "rgba(255,255,255,0.08)",
        "text-primary": "#F0F0FF",
        "text-secondary": "#8892B0",
        accent: {
          DEFAULT: "#6C5CE7",
          light: "#8B7FF7",
        },
        status: {
          clear: "#00D395",
          mixed: "#F6AD55",
          concern: "#ED8936",
          risk: "#E53E3E",
          none: "#6C7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["14px", { lineHeight: "20px" }],
      },
      borderRadius: {
        card: "16px",
        control: "10px",
        pill: "9999px",
      },
      maxWidth: {
        page: "1080px",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0px 0px rgba(237,137,54,0)" },
          "50%": { boxShadow: "0 0 14px 2px rgba(237,137,54,0.55)" },
        },
        "risk-pulse": {
          "0%, 100%": { boxShadow: "0 0 0px 0px rgba(229,62,62,0)" },
          "50%": { boxShadow: "0 0 16px 2px rgba(229,62,62,0.6)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.9) translateY(4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "risk-pulse": "risk-pulse 1.8s ease-in-out infinite",
        "pop-in": "pop-in 0.15s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
