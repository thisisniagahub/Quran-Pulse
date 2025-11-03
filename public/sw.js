// sw.js - Service Worker for QuranPulse PWA
const CACHE_NAME = 'quranpulse-v1.0';
const STATIC_CACHE = 'static-v1.0';
const API_CACHE = 'api-v1.0';

// Static assets to cache initially
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/static/js/bundle.js',
  '/static/css/main.css',
  'https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Inter:wght@400;500;600;700&display=swap'
];

// URLs that should bypass cache
const NO_CACHE_URLS = [
  '/api/',
  '/auth/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        self.skipWaiting(); // Force activation
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  // Don't cache specific URLs
  if (shouldNotCache(event.request.url)) {
    return;
  }

  // Handle different types of requests differently
  if (isApiRequest(event.request.url)) {
    // API requests: network-first with cache fallback
    event.respondWith(
      handleApiRequest(event.request)
    );
  } else if (isStaticAsset(event.request.url)) {
    // Static assets: cache-first
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  } else {
    // Other requests: network-first with cache fallback
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
});

// Check if URL should not be cached
function shouldNotCache(url) {
  return NO_CACHE_URLS.some(pattern => url.includes(pattern));
}

// Check if it's an API request
function isApiRequest(url) {
  return url.includes('/api/');
}

// Check if it's a static asset
function isStaticAsset(url) {
  return url.includes('.css') || url.includes('.js') || url.includes('.png') || 
         url.includes('.jpg') || url.includes('.jpeg') || url.includes('.ico') ||
         url.includes('.woff') || url.includes('.woff2') || url.includes('.ttf');
}

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, cache the response
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      caches.open(API_CACHE)
        .then((cache) => {
          cache.put(request, responseToCache);
        });
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Serving from cache (API fallback):', request.url);
      return cachedResponse;
    }
    
    // No cache available, return error
    throw error;
  }
}

// Message event - for manual cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_ASSETS') {
    event.waitUntil(
      caches.open(STATIC_CACHE)
        .then((cache) => {
          return cache.addAll(event.data.assets);
        })
    );
  }
});