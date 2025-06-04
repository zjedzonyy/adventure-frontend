/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "oklch(54.6% 0.245 262.881)", // Blue 600
        secondary: "oklch(55.8% 0.288 302.321)", // Purple 600
        background: "oklch(98.5% 0.002 247.839)", // White (Grey 50)
        dark_primary: "oklch(42.4% 0.199 265.638)", // Blue 800
        dark_secondary: "oklch(38.1% 0.176 304.987)", // Purple 900
        dark_background: "oklch(27.8% 0.033 256.848)", // Gray 800
        dark_background_secondary: "oklch(44.6% 0.043 257.281)", // Slate 500
        text_primary: "white", // White
        text_secondary: "oklch(10.2% 0.05 0)", // Black
      },
    },
  },
  plugins: [],
  darkMode: "class", // Enable dark mode support
};
