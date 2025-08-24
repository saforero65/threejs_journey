import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  publicDir: "../public/",
  base: "./",
  server: {
    host: true,
    port: 3000,
    open: true,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
        },
      },
    },
  },
});
