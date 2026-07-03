import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "color-lens",
      fileName: "color-lens",
      formats: ["iife", "es"]
    },
    rollupOptions: {
      output: { inlineDynamicImports: true }
    },
    minify: "terser"
  },
  define: {
    "process.env.NODE_ENV": '"production"'
  }
});
