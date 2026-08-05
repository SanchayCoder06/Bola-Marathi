// ============================================================
// बोला मराठी — Service Worker
// Caches app shell and lesson data for offline support
// ============================================================

const CACHE_NAME = 'bola-marathi-v21';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/src/presentation/app.js',
  '/src/application/state/appState.js',
  '/src/application/state/router.js',
  '/src/core/engines/gameEngine.js',
  '/src/core/engines/progressEngine.js',
  '/src/core/engines/revisionEngine.js',
  '/src/core/engines/revisionManager.js',
  '/src/core/engines/detectiveManager.js',
  '/src/core/engines/conversationEngine.js',
  '/src/core/engines/learningEngine.js',
  '/src/core/engines/audioEngine.js',
  '/src/core/engines/aiEngine.js',
  '/src/core/engines/storyEngine.js',
  '/src/core/engines/cultureEngine.js',
  '/src/core/engines/dictionaryEngine.js',
  '/src/infrastructure/storage/db.js',
  '/src/infrastructure/storage/storageManager.js',
  '/src/presentation/screens/homeScreen.js',
  '/src/presentation/screens/journeyScreen.js',
  '/src/presentation/screens/practiceScreen.js',
  '/src/presentation/screens/dictionaryScreen.js',
  '/src/presentation/screens/profileScreen.js',
  '/data/cities/cities.json',
  '/data/conversations/conversations.json',
  '/data/culture/culture.json',
  '/data/chapters/chapters.json',
  '/data/missions/missions.json',
  '/data/dictionary/dictionary.json',
  '/data/lessons/lessons.json',
  '/assets/images/modak.png',
  '/assets/images/ganesh_chaturthi.png',
  '/assets/images/shivaji_maharaj.png',
  '/assets/images/lavani.png',
  '/assets/images/restaurant_scene.png',
  '/assets/images/water_glass.png',
  '/manifest.json'
];

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch — network-first with cache fallback for app shell, cache-first for fonts/external static resources
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Pure network request for Vercel Serverless Function /api/ calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch((err) => {
        return new Response(
          JSON.stringify({ error: `Offline — Server API is unavailable: ${err.message}` }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Network-first for Gemini API calls
  if (url.hostname === 'generativelanguage.googleapis.com') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Offline — AI feedback unavailable' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Network-first for Google Fonts (with cache fallback)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Network-first with cache fallback for everything else (app shell, lesson data)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful GET responses
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
