import { defineConfig, esbuildVersion, optimizeDeps } from "vite";

export default defineConfig({
  root: "./",
  base: "/",
  publicDir: "public",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  plugins: [],
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
});
