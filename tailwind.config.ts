import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "var(--background)",
        "foreground": "var(--foreground)",
        "text": "var(--text)",
        "text-faded": "var(--text-faded)",
        "text-disabled": "var(--text-disabled)",
        "text-strong": "var(--text-strong)",
        "border": "var(--border)",
        "shadow": "var(--shadow)",
        "background-button-hover": "var(--background-button-hover)",
        "foreground-dark": "var(--foreground-dark)",
        "foreground-darker": "var(--foreground-darker)",
        "border-grid": "var(--border-grid)",
        "background-grid": "var(--background-grid)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        "2xs": ".625rem",
      },
      animation: {
        "overlay-show": "overlay-show 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "content-show": "content-show 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "habit-card-show":
          "habit-card-show 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "habit-pop": "habit-pop 250ms ease-in-out forwards",
      },
      keyframes: {
        "overlay-show": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "content-show": {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        "habit-card-show": {
          from: { opacity: "0", transform: "translateY(1rem) scale(0.90)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "habit-pop": {
          from: { scale: "1", boxShadow: "0 0 #0000"},
          to: { scale: "1.02", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
