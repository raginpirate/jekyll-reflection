importScripts("/assets/js/vendor/workbox/workbox-sw.js");
workbox.setConfig({
    modulePathPrefix: '/assets/js/vendor/workbox'
});

workbox.routing.registerRoute(
  /\.(?:png|webp|svg|js|webmanifest)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'jekyll-reflection'
  })
);

workbox.routing.registerRoute(
  /\.(?:html|pdf)$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'html-cache',
  })
);

workbox.precaching.precacheAndRoute([
    '/index.html',
    '/404.html'
]);