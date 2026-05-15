/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071216",
        panel: "rgba(13, 25, 28, 0.78)",
        line: "rgba(196, 211, 205, 0.16)",
        mint: "#3DE7B3",
        cyan: "#42D9F5",
        amber: "#F7B955",
        rose: "#FF6978",
      },
      boxShadow: {
        glass: "0 18px 46px rgba(0, 0, 0, 0.28)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
