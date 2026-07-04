import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "colorlens",
      formats: ["iife", "es"]
    },
    rollupOptions: {
      output: { codeSplitting: false }
    },
    minify: "terser"
  },
  define: {
    "process.env.NODE_ENV": '"production"'
  },
  server: {}
});
