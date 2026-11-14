// PRAPOSHAN app shell: pages work offline after the first visit. Never caches form posts.
var CACHE = 'praposhan-v1';
var CORE = ['./', 'index.html', 'sleep-gap.html', 'zenith-quiz.html', 'deep-dive.html', 'programs.html',
  'assets/site.css', 'assets/site.js', 'assets/app/icon-192.png', 'manifest.webmanifest'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  // network first, so updates show at once; cache as the offline fallback
  e.respondWith(fetch(r).then(function (res) {
    var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copy); }); return res;
  }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match('index.html'); }); }));
});
