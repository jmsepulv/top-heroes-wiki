// Top Heroes Wiki - Progressive Web App Service Worker (v1)
const CACHE_NAME = 'top-heroes-pwa-v1';
const BASE_PATH = '/top-heroes-wiki';

const PRECACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.webmanifest`,
  `${BASE_PATH}/icons/icon.svg`,
  `${BASE_PATH}/icons/icon-192.png`,
  `${BASE_PATH}/icons/icon-512.png`,
  `${BASE_PATH}/icons/apple-touch-icon.png`,
  `${BASE_PATH}/roster/`,
  `${BASE_PATH}/sandbox/`,
  `${BASE_PATH}/calculators/`,
  `${BASE_PATH}/simulator/`,
  `${BASE_PATH}/compare/`,
  `${BASE_PATH}/progression/`,
  `${BASE_PATH}/gear/`,
  `${BASE_PATH}/events/`,
  `${BASE_PATH}/lineups/`,
  `${BASE_PATH}/guides/`
];

// Install: precache app shell and static pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up outdated caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for HTML navigations with Cache fallback; Cache-First for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET requests
  if (req.method !== 'GET') return;

  // Handle HTML navigation requests: Network-First, falling back to cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(req).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Fallback to home page if specific route is not cached
            return caches.match(`${BASE_PATH}/`);
          });
        })
    );
    return;
  }

  // Handle static assets (JS, CSS, images, fonts): Stale-While-Revalidate
  if (
    url.pathname.includes('/images/') ||
    url.pathname.includes('/icons/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        const fetchPromise = fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(req, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network fetch with cache fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
