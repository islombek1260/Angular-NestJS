/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <--- Добавь эту строку
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}