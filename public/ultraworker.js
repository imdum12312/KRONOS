importScripts("scram/scramjet.all.js");

if (navigator.userAgent.includes("Firefox")) {
  Object.defineProperty(globalThis, "crossOriginIsolated", {
    value: true,
    writable: true,
  })
}

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

// Flag to track if config is loaded
let configLoaded = false;

self.addEventListener("install", (event) => {
  console.log('[SW] Installing service worker');
  self.skipWaiting();
})

self.addEventListener("activate", (event) => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      console.log('[SW] Service worker activated and claimed clients');
    })()
  );
})

async function handleRequest(event) {
  if (!configLoaded) {
    await scramjet.loadConfig();
    configLoaded = true;
  }
  
  if (scramjet.route(event)) {
    return scramjet.fetch(event);
  }
  
  return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
})