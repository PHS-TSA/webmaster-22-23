/** Module for the service worker
 * @module serviceWorker
 * @see module:script
 *
 * {@link https://github.com/halfzebra/create-elm-app/tree/master/template#making-a-progressive-web-app}
 * {@link https://create-react-app.dev/docs/making-a-progressive-web-app/}
 * {@link https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers}
 */

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./modules/serviceWorker.js");
}

const cacheName = "cclPWA-v1";
const appShellFiles = [
  "/webmaster-22-23/",
  "/webmaster-22-23/index.html",
  "/webmaster-22-23/script.js",
  "/webmaster-22-23/style.css",
  "/webmaster-22-23/favicon.ico",
  "/webmaster-22-23/images/logo-main.png",
];

const contentToCache = appShellFiles.concat();

self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(contentToCache);
    })()
  );
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});
