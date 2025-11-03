/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-light": "var(--primary-light)",
        "primary-dark": "var(--primary-dark)",
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
        "accent-dark": "var(--accent-dark)",
        background: "var(--background)",
        "background-dark": "var(--background-dark)",
        text: "var(--text)",
        "text-light": "var(--text-light)",
      },
    },
  },
  plugins: [],
}