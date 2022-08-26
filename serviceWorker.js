const CACHE_NAME = "qna-v1"
const assets = [
  "/",
  "/index.html",
  "/bank.html",
  "/current.html",
  "/personnal.html",
  "/offline.html",
  "/app.js",
  "/images/icon.png",
  "/images/favicon.png",
  "/images/ni.gif"
]

self.addEventListener("install", (installEvent) => {

    const preCache = async () => {
        const cache = await caches.open(CACHE_NAME);
        // Setting {cache: 'reload'} in the new request ensures that the
        // response isn't fulfilled from the HTTP cache; i.e., it will be
        // from the network.
        await cache.add(new Request('offline.html', { cache: "reload" }));
    };

    installEvent.waitUntil(preCache);
})

self.addEventListener("fetch", fetchEvent => {
    if (fetchEvent.request.mode === "navigate") {
        fetchEvent.respondWith(
          (async () => {
            try {
              // First, try to use the navigation preload response if it's
              // supported.
              const preloadResponse = await fetchEvent.preloadResponse;
              if (preloadResponse) {
                return preloadResponse;
              }
    
              // Always try the network first.
              const networkResponse = await fetch(fetchEvent.request);
              return networkResponse;
            } catch (error) {
              // catch is only triggered if an exception is thrown, which is
              // likely due to a network error.
              // If fetch() returns a valid HTTP response with a response code in
              // the 4xx or 5xx range, the catch() will NOT be called.
              console.log("Fetch failed; returning offline page instead.", error);
    
              const cache = await caches.open(CACHE_NAME);
              const cachedResponse = await cache.match('offline.html');
              return cachedResponse;
            }
          })()
        );
    }
})