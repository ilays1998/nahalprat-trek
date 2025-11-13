// Simple service worker for caching static assets
const CACHE_NAME = 'nahal-prat-trek-v1';
const urlsToCache = [
  '/',
  '/src/index.js',
  '/src/index.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Rubik:wght@400;500;600;700&display=swap',
  'https://unpkg.com/aos@2.3.1/dist/aos.css'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});