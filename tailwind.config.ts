import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        "2xs": ".625rem",
      },
      animation: {
        "overlay-show": 'overlay-show 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        "content-show": 'content-show 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        "habit-card-show": 'habit-card-show 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        "habit-pop": 'habit-pop 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        "overlay-show": {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        "content-show": {
          from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        "habit-card-show": {
          from: { opacity: '0', transform: 'translateY(1rem) scale(0.90)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        "habit-pop": {
          from: { scale: '1' },
          to: { scale: '1.02' },
        },
      }
    },
  },
  plugins: [],
};
export default config;
