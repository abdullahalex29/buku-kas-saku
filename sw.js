/* Service worker Buku Kas Saku: aplikasi tetap bisa dibuka tanpa internet. */
const VERSION = "bks-v1.0.0";
const FONT_CACHE = "bks-fonts";
const SHELL = [
  "./",
  "./index.html",
  "./config.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== FONT_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    const isPage = req.mode === "navigate" || url.pathname.endsWith(".html");
    const isConfig = url.pathname.endsWith("/config.js");
    if (isPage || isConfig) {
      // Jaringan dulu supaya versi baru dan Client ID cepat terpakai; cache kalau offline.
      const key = isPage ? "./index.html" : "./config.js";
      event.respondWith(
        fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(key, copy));
            }
            return res;
          })
          .catch(() => caches.match(key).then((r) => r || caches.match("./")))
      );
      return;
    }
    // Ikon dan manifest: cache dulu.
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      }))
    );
    return;
  }

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(req).then((hit) => hit || fetch(req).then((res) => {
          if (res.ok || res.type === "opaque") cache.put(req, res.clone());
          return res;
        }))
      )
    );
  }
  // Permintaan ke Google (login, Drive) tidak disentuh.
});
