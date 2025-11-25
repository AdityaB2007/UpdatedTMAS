import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // Background colors from CSS variables
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-tertiary": "var(--bg-tertiary)",

        // Text colors
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",

        // Accent colors
        "accent-yellow": "var(--accent-yellow)",
        "accent-amber": "var(--accent-amber)",
        "accent-orange": "var(--accent-orange)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        "glow-yellow": "var(--shadow-glow-yellow)",
        "glow-amber": "var(--shadow-glow-amber)",
      },
      transitionTimingFunction: {
        smooth: "var(--ease-smooth)",
        bounce: "var(--ease-bounce)",
        slow: "var(--ease-slow)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
      },
      backdropBlur: {
        glass: "var(--glass-blur)",
      },
    },
  },
  plugins: [],
};

export default config;
