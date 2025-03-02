self.importScripts('data/games.js');

// Files to cache
const cacheName = 'js13kPWA-v1';
const appShellFiles = [
    '/MDN/js13kGames/',
    '/MDN/js13kGames/index.html',
    '/MDN/js13kGames/app.js',
    '/MDN/js13kGames/style.css',
    '/MDN/js13kGames/fonts/graduate.eot',
    '/MDN/js13kGames/fonts/graduate.ttf',
    '/MDN/js13kGames/fonts/graduate.woff',
    '/MDN/js13kGames/favicon.ico',
    '/MDN/js13kGames/img/js13kgames.png',
    '/MDN/js13kGames/img/bg.png',
    '/MDN/js13kGames/icons/icon-32.png',
    '/MDN/js13kGames/icons/icon-64.png',
    '/MDN/js13kGames/icons/icon-96.png',
    '/MDN/js13kGames/icons/icon-128.png',
    '/MDN/js13kGames/icons/icon-168.png',
    '/MDN/js13kGames/icons/icon-192.png',
    '/MDN/js13kGames/icons/icon-256.png',
    '/MDN/js13kGames/icons/icon-512.png',
];
const gamesImages = [];
for (let i = 0; i < games.length; i++) {
    gamesImages.push(`data/img/${games[i].slug}.jpg`);
}
const contentToCache = appShellFiles.concat(gamesImages);

// Installing Service Worker
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
    })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
    // Cache http and https only, skip unsupported chrome-extension:// and file://...
    if (!(
        e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
    )) {
        return;
    }

    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) return r;
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
});