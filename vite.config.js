import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo.png"],
      manifest: {
        name: "Si Huki",
        short_name: "SiHuki",
        description: "One stop legal service untuk UMKM",
        theme_color: "#cc0000",
        icons: [
          {
            src: "icons/192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
