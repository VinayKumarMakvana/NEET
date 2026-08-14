const CACHE_NAME = 'neet-2028-v2.8.0';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './brand.css',
  './manifest.webmanifest',
  './favicon.svg',
  './js/syllabus-data.js',
  './js/books-data.js',
  './js/resources-data.js',
  './js/notes-data.js',
  './js/flashcards-data.js',
  './js/questions-data.js',
  './js/scientist-data.js',
  './js/formula-rapid-fire.js',
  './js/pyq-heatmap.js',
  './js/cheat-sheets.js',
  './js/aiims-explorer.js',
  './js/speed-math.js',
  './js/gamification.js',
  './js/audio-podcast.js',
  './js/problem-solver.js',
  './js/omr-engine.js',
  './js/test-tree-engine.js',
  './js/payment-engine.js',
  './js/mock-engine.js',
  './js/rank-predictor.js',
  './js/mistake-notebook.js',
  './js/certificate.js',
  './js/pwa-installer.js',
  './js/auth-clerk.js',
  './js/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => console.warn('Cache addAll warning:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Network-First strategy to ensure latest UI updates are always displayed
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

