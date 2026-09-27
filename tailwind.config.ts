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
      borderRadius: {
        card: "16px",
        control: "10px",
        pill: "9999px",
      },
      maxWidth: {
        page: "1080px",
      },
    },
  },
  plugins: [],
};
export default config;
