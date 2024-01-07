/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Tinos", "serif"],
      poppins: ["Poppins","sans-serif"]
    },
    extend: {
      colors: {
        primary: '#013A98',
        base: '#F6F6F6',
      },
    },
  },
  plugins: [],
}