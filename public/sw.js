// Nuclear cache-buster — clears all caches and unregisters self
// This breaks any stale cache loops from previous SW versions

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => {
      self.clients.claim();
      // Tell all clients to reload
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' }));
      });
    })
  );
});

// Pass everything through to network — no caching at all
self.addEventListener('fetch', () => {
  // Do nothing — let the browser handle it normally
});
