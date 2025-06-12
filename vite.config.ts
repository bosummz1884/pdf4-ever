import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    // 🚫 Removed cartographer plugin to prevent build error in non-Replit environments
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: ".", // ✅ root is current folder since index.html is in project root
  build: {
    outDir: "dist", // ✅ standard output folder for Cloudflare Pages
    emptyOutDir: true,
    rollupOptions: {
      input: "index.html", // ✅ ensure Vite knows where your real entry point is
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Each dependency gets its own chunk (improves caching/splits big libs)
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
