/**
 * Gramin PocketLab — Cache-First Offline Service Worker
 * File: app/sw.js
 * Version: pocketlab-v2
 * Strategy: Cache-First with Stale-While-Revalidate & Graceful Offline Fallback
 */

const CACHE_NAME = 'pocketlab-v3';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon.svg',
  './css/tokens.css',
  './css/main.css',
  './js/app.js',
  './js/store.js',
  './js/router.js',
  './content/i18n.js',
  './content/missions_data.js',
  './content/curriculum_registry.js',
  './engine/learning_runner.js',
  './engine/ai_tutor.js',
  './engine/mock_exam_engine.js',
  './modules/physics.js',
  './modules/math_stub.js',
  './modules/biology_stub.js',
  './modules/chemistry_stub.js',
  './modules/fractions_module.js',
  './modules/optics_module.js',
  './modules/calculus_module.js',
  './modules/coding_module.js'
];

/**
 * Service Worker Installation
 * Pre-caches core application shell and modules.
 * Uses Promise.allSettled to be resilient if any module is still being compiled.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log(`[ServiceWorker ${CACHE_NAME}] Pre-caching static assets...`);
      await Promise.allSettled(
        PRECACHE_ASSETS.map(async (assetUrl) => {
          try {
            const response = await fetch(assetUrl, { cache: 'no-cache' });
            if (response.ok) {
              await cache.put(assetUrl, response);
            }
          } catch (fetchErr) {
            // Non-blocking warning so other assets are reliably cached
            console.warn(`[ServiceWorker] Pre-cache skipped for "${assetUrl}":`, fetchErr.message);
          }
        })
      );
      return self.skipWaiting();
    })
  );
});

/**
 * Service Worker Activation
 * Cleans up any deprecated cache buckets from previous versions.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((existingCache) => {
            if (existingCache !== CACHE_NAME) {
              console.log(`[ServiceWorker] Purging stale cache: ${existingCache}`);
              return caches.delete(existingCache);
            }
            return Promise.resolve();
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

/**
 * Service Worker Fetch Interception
 * Implements Cache-First with background Stale-While-Revalidate.
 * Seamlessly delivers offline access for rural low-connectivity classrooms.
 */
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests with HTTP/HTTPS schemes
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Check cache first
      const cachedResponse = await cache.match(request);

      // Background network revalidation promise
      const networkUpdatePromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // Network unavailable or offline
          return null;
        });

      // If cached copy exists, return it immediately and revalidate in background
      if (cachedResponse) {
        event.waitUntil(networkUpdatePromise);
        return cachedResponse;
      }

      // Not in cache: await network response
      const networkResponse = await networkUpdatePromise;
      if (networkResponse) {
        return networkResponse;
      }

      // Network failed & not in cache: Handle offline fallback
      if (request.mode === 'navigate') {
        const fallbackShell = (await cache.match('./index.html')) || (await cache.match('./'));
        if (fallbackShell) {
          return fallbackShell;
        }
      }

      // Return synthetic offline response
      return new Response('PocketLab: You are currently offline and this asset is not yet cached.', {
        status: 503,
        statusText: 'Service Unavailable (Offline)',
        headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
      });
    })
  );
});
