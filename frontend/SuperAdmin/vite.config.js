import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Generate sourcemaps for better error tracking
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
