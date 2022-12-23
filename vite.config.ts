import { resolve } from "path";
import { defineConfig } from "vite";
import { webfontDownload } from "vite-plugin-webfont-dl";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
    minify: true,
  },
  plugins: [
    webfontDownload(
      ["https://fonts.googleapis.com/css2?family=Montserrat&display=swap"],
      { injectAsStyleTag: false }
    ),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
