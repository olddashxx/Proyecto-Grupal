/* ============================================================================
   [FUNCIONALIDAD PWA OFFLINE-FIRST]: Service Worker — Sabores de Mi Tierra
   - Precachea HTML, CSS, JS, Manifiesto y gráficos SVG en 'install'
   - Limpia versiones antiguas de caché en 'activate'
   - Responde desde Cache Storage con respaldo de red en 'fetch'
   ============================================================================ */

const CACHE_NAME = 'sabores-bolivia-pwa-v1';

const LOCAL_ASSETS = [
  './',
  './index.html',
  './mobile.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './img/fritanga.svg',
  './img/sajta.svg',
  './img/ranga.svg',
  './img/fricase.svg',
  './img/falso-conejo.svg',
  './img/embol-cocacola.svg',
  './img/embol-sabores.svg',
  './img/embol-vital.svg'
];

const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      CDN_ASSETS.forEach((url) => {
        cache.add(url).catch(() => {
          console.log('[PWA Sabores] Recurso CDN omitido sin red:', url);
        });
      });
      return cache.addAll(LOCAL_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((oldKey) => caches.delete(oldKey))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./mobile.html');
          }
        });
    })
  );
});
