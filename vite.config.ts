import path from "node:path";
import fs from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function copyGeneratedClientPlugin() {
  return {
    name: "copy-generated-client",
    closeBundle() {
      const source = path.resolve(__dirname, "src/generated");
      const target = path.resolve(__dirname, "dist/generated");

      if (!fs.existsSync(source)) {
        return;
      }

      fs.rmSync(target, { recursive: true, force: true });
      fs.cpSync(source, target, { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), copyGeneratedClientPlugin()],
  root: path.resolve(__dirname, "src/renderer"),
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "dist/renderer"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["@prisma/client", ".prisma/client", "prisma"],
    },
  },
  resolve: {
    alias: {
      "@renderer": path.resolve(__dirname, "src/renderer"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
