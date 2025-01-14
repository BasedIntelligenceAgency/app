import { fontFamily } from "tailwindcss/defaultTheme";

export const theme = {
  extend: {
    fontFamily: {
      mono: ["Roboto Mono", ...fontFamily.mono],
    },
    letterSpacing: {
      "tighter-custom": "-0.02em",
    },
    typography: {
      DEFAULT: {
        css: {
          h1: {
            fontFamily: "Roboto Mono",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            color: "#00FF04",
          },
          h2: {
            fontFamily: "Roboto Mono",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            color: "#00FF04",
          },
          h3: {
            fontFamily: "Roboto Mono",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            color: "#00FF04",
          },
          h4: {
            fontFamily: "Roboto Mono",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            color: "#00FF04",
          },
        },
      },
    },
  },
};
