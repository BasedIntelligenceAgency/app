import { theme } from "./theme";

const typography = require("@tailwindcss/typography");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    ...theme,
    extend: {
      colors: {
        primary: "#00FF04",
      },
      animation: {
        scroll: "scroll 10s linear infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [
    typography({
      css: {
        color: "#00FF04",
        "--tw-prose-body": "#00FF04",
        "--tw-prose-headings": "#00FF04",
        "--tw-prose-lead": "#00FF04",
        "--tw-prose-links": "#00FF04",
        "--tw-prose-bold": "#00FF04",
        "--tw-prose-counters": "#00FF04",
        "--tw-prose-bullets": "#00FF04",
        "--tw-prose-hr": "#00FF04",
        "--tw-prose-quotes": "#00FF04",
        "--tw-prose-quote-borders": "#00FF04",
        "--tw-prose-captions": "#00FF04",
        "--tw-prose-code": "#00FF04",
        "--tw-prose-pre-code": "#00FF04",
        "--tw-prose-pre-bg": "#000",
        "--tw-prose-th-borders": "#00FF04",
        "--tw-prose-td-borders": "#00FF04",
      },
    }),
  ],
};
