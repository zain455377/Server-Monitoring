/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: { colors: {
        dashboardBg: '#491c90',
      },},
  },
  plugins: [require("daisyui")],
}
