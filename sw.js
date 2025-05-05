self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('doctor-net-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/admin.html',
        '/manifest.json',
        'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js',
        'https://cdn.jsdelivr.net/npm/ar.js@2.2.2/three.js/build/ar.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
        'https://unpkg.com/libphonenumber-js@1.10.14/bundle/libphonenumber-min.js',
        'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js'
      ]).catch(error => {
        console.error('Cache addAll failed:', error);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(error => {
        console.error('Fetch failed:', error);
      });
    })
  );
});