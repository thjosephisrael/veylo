import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  root: path.resolve(import.meta.dirname),
  server: {
    port: 3001,
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          content: [
            path.resolve(import.meta.dirname, "./index.html"),
            path.resolve(import.meta.dirname, "./src/**/*.{js,ts,jsx,tsx}"),
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
        }),
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  esbuild: {
    jsx: "automatic",
  },
});
