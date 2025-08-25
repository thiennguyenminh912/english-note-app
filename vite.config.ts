import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));

// https://vite.dev/config/
export default defineConfig({
  base: "/english-note-app/",
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, "dist/index.html"),
          dest: "",
          rename: "404.html",
        },
      ],
    }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "logo.jpg", "icons/*.png"],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      manifest: {
        name: "English Vocabulary App",
        short_name: "EngVocab",
        description: "English Vocabulary App",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "icons/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
