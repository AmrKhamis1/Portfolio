import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [react(), glsl()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/index.js`,
        chunkFileNames: `assets/chunk-[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  base: "",
});
