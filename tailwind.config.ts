import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./dev/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 120ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      colors: {
        // Gridwork brand blue — primary accent colour
        // Matches Pantone 2727 / approx #4479F2
        gw: {
          50:  "#eef4fe",
          100: "#d6e5fd",
          200: "#adcbfb",
          300: "#84aff8",
          400: "#6097f6",
          500: "#5a91f5",  // hover state
          600: "#4782f3",  // primary buttons
          700: "#3166d4",
          800: "#2450aa",
          900: "#183c82",
        },
        // Gridwork near-black — #1C2021
        ink: {
          DEFAULT: "#1c2021",
          light: "#2d3233",
        },
      },
    },
  },
  safelist: [
    { pattern: /^(bg|text|border|ring|focus:border|focus:ring|hover:bg)-gw-/ },
  ],
  plugins: [],
};

export default config;
