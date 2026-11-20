/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        reel: {
          dark: "#08090D",
          surface: "#11131B",
          card: "#171A24",
          border: "#25293A",
          accent: "#E50914",
          gold: "#D8F15B",
        },
      },
    },
  },
  plugins: [],
};
