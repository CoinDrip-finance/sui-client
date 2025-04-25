module.exports = {
  mode: "jit",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", './node_modules/@assistant-ui/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: "#0296FF",
        secondary: "#012D46",
      },
      minHeight: () => ({
        "half-screen": "50vh",
      }),
      maxWidth: {
        "screen-xs": "580px",
      },
      boxShadow: {
        'primary-btn': '0 8px 12px 0 rgba(2, 150, 255, 0.25)', 
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require('@tailwindcss/typography'),  require("tailwindcss-animate"), require("@assistant-ui/react-ui/tailwindcss")],
};
