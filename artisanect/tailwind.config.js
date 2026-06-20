/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FAF6EF",
          dark: "#F0E9DB",
        },
        ink: {
          DEFAULT: "#22324A",
          light: "#33486B",
          dark: "#152033",
        },
        clay: {
          DEFAULT: "#BD5B38",
          dark: "#9C4527",
          light: "#E2916E",
        },
        gold: {
          DEFAULT: "#D6A23C",
          light: "#EFC978",
        },
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "stitch-line":
          "repeating-linear-gradient(90deg, currentColor 0, currentColor 8px, transparent 8px, transparent 16px)",
      },
    },
  },
  plugins: [],
};
