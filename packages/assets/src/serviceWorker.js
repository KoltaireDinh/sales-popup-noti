/**
 * Register a service worker for cache everything and load an application faster.
 * It only works on production mode
 * @link https://developers.google.com/web/tools/workbox/guides/codelabs/webpack
 */
export function register() {
  if (import.meta.env.VITE_NODE_ENV !== 'production' || !'serviceWorker' in navigator) {
    return;
  }
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });

    // self.addEventListener('install', function(event) {
    //   event.waitUntil(
    //     caches.keys().then(function(cacheNames) {
    //       return Promise.all(
    //         cacheNames
    //           .filter(function(cacheName) {
    //             // Return true if you want to remove this cache,
    //             // but remember that caches are shared across
    //             // the whole origin
    //           })
    //           .map(function(cacheName) {
    //             return caches.delete(cacheName);
    //           })
    //       );
    //     })
    //   );
    // });
  });
}
