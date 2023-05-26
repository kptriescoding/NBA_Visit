/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#f8f4ed',
        'primaryfocus-bg': '#efe4db',
      },
    }
  },
  plugins: [require("daisyui")],
}

