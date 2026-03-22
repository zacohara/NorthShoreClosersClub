// Self-destructing service worker
// When installed, it nukes all caches, unregisters itself, and force-reloads every open tab
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(k => Promise.all(k.map(c => caches.delete(c))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({type: 'window'}))
      .then(clients => {
        clients.forEach(c => c.navigate(c.url));
      })
      .then(() => self.registration.unregister())
  );
});
// Pass all fetches through to network - no caching ever
self.addEventListener('fetch', () => {});
