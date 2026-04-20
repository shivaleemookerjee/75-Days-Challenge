self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('glow-cache').then(cache => {
      return cache.addAll(['index.html']);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

// 🔔 BACKGROUND PUSH
self.addEventListener('push', function(event) {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "https://cdn-icons-png.flaticon.com/512/744/744465.png"
  });
});
