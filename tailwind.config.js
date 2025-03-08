module.exports = {
  mode: "jit",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00FFFA",
        secondary: "#00ACFF",
      },
      minHeight: () => ({
        "half-screen": "50vh",
      }),
      maxWidth: {
        "screen-xs": "580px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
