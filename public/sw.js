/*
 * iKnowAPDF service worker.
 *
 * Strategy:
 *  - Navigations (HTML): network-first, falling back to the cached copy (offline support
 *    for pages the user has already visited). This guarantees returning visitors always
 *    get the HTML of the current deploy, which references the current hashed chunks.
 *  - /_next/static/* and /pdfjs/*: cache-first (content-hashed / versioned, immutable).
 *    NOTE: /pdfjs/* filenames are not hashed - bump CACHE_VERSION if pdf.js is upgraded.
 *  - Everything else (cross-origin, non-GET, RSC payloads, other assets): untouched,
 *    handled by the browser + HTTP cache as normal.
 *
 * Bump CACHE_VERSION whenever the caching strategy changes; old caches are purged on activate.
 */
const CACHE_VERSION = "iknowapdf-v3";
const PAGES_CACHE = `${CACHE_VERSION}-pages`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const PRECACHE_PAGES = ["/"];
const PRECACHE_STATIC = ["/pdfjs/pdf.min.js", "/pdfjs/pdf.worker.min.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .open(PAGES_CACHE)
        .then((cache) => cache.addAll(PRECACHE_PAGES))
        .catch(() => {}),
      caches
        .open(STATIC_CACHE)
        .then((cache) => cache.addAll(PRECACHE_STATIC))
        .catch(() => {}),
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== PAGES_CACHE && key !== STATIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isRscRequest(request, url) {
  return (
    url.searchParams.has("_rsc") ||
    url.pathname.endsWith(".txt") ||
    request.headers.get("RSC") === "1" ||
    request.headers.get("Next-Router-Prefetch") === "1"
  );
}

function isImmutableAsset(url) {
  return url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/pdfjs/");
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const response = await fetch(request);
    const contentType = response.headers.get("Content-Type") || "";
    if (
      response.ok &&
      response.type === "basic" &&
      !response.redirected &&
      contentType.includes("text/html")
    ) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (err) {
    // Only serve the exact page that was cached (serving "/" for another URL would make the
    // app router render the wrong route). Unvisited pages fall through to the browser offline UI.
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    throw err;
  }
}

async function cacheFirstStatic(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isRscRequest(request, url)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (isImmutableAsset(url)) {
    event.respondWith(cacheFirstStatic(request));
  }
});
