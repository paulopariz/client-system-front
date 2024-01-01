/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-primary": "#08031A",
        "blue-secondary": "#292E4B",
      },
    },
  },
  plugins: [],
};
