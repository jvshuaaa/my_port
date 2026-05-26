/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app.js",
    "./**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#149ddd',
        secondary: '#667eea',
        accent: '#e74c3c',
      }
    },
  },
  plugins: [],
}
