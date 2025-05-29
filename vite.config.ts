import { defineConfig } from 'vite'
import wyw from "@wyw-in-js/vite";
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wyw({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-react", "@babel/preset-typescript"],
      },
    }),
  ],
})