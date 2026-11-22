/* 오늘의 자각공부 — 서비스 워커
   크롬에서 "앱 설치"가 뜨게 하고, 인터넷이 없어도 열리게 합니다.
   화면(페이지)은 인터넷이 되면 항상 최신으로 받아 오고, 안 되면 저장해 둔 것을 보여 줍니다. */

const CACHE = "jagak-v13";
const CORE = ["/", "/manifest.webmanifest", "/buddha3.webp", "/coin.webp", "/icon-192.png", "/icon-512.png", "/favicon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // 페이지: 인터넷 먼저, 안 되면 저장본
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put("/", copy)); return res; })
        .catch(() => caches.match("/"))
    );
    return;
  }

  // 그림·글꼴 등: 저장본 먼저, 없으면 받아서 저장
  if (url.origin === location.origin || url.host.endsWith("gstatic.com") || url.host.endsWith("googleapis.com")) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
