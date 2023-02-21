import { resolve } from "path";
import { defineConfig } from "vite";
import { ViteWebfontDownload } from "vite-plugin-webfont-dl";
import { VitePWA } from "vite-plugin-pwa";
import lightningcss from "vite-plugin-lightningcss";
import { createMpaPlugin, createPages } from "vite-plugin-virtual-mpa";

const pages = createPages([
  { name: "index" },
  { name: "about-us" },
  // You can pass a single page object or a pages array.
]);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  resolve: {
    alias: {
      "~bootstrap": resolve(__dirname, "node_modules/bootstrap"),
      "~bootstrap-icons": resolve(__dirname, "node_modules/bootstrap-icons"),
    },
  },
  test: {
    coverage: {
      provider: "c8", // or 'istanbul'
      reporter: ["text", "html", "json-summary", "json"],
    },
  },
  plugins: [
    createMpaPlugin({ pages: pages }),
    ViteWebfontDownload(
      ["https://fonts.googleapis.com/css2?family=Montserrat&display=swap"],
      { injectAsStyleTag: true }
    ),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        lang: "en-latn-us",
        icons: [
          {
            src: "src/images/large-favicon.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
        background_color: "#005",
        orientation: "portrait",
        display: "standalone",
        categories: [],
        description: "Home of the world's first cosmic cruise line!",
        name: "Cosmic Cruise Lines",
        short_name: "CCL",
        prefer_related_applications: false,
        related_applications: [],
        theme_color: "#005",
        start_url: "/webmaster-22-23",
        scope: "/webmaster-22-23",
      },
    }),
    lightningcss({
      browserslist: "last 2 versions",
    }),
  ],
  base: "/webmaster-22-23",
});
