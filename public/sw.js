/* 훌라 — 최소 서비스 워커
   안드로이드 크롬에서 "앱 설치" 메뉴가 뜨려면 이 파일이 필요해요.
   캐시는 하지 않고, 항상 네트워크에서 최신 내용을 가져옵니다.
   (글이 실시간으로 공유되는 앱이라 캐시하면 오히려 오래된 글이 보일 수 있어요) */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // 네트워크 우선. 오프라인이면 브라우저 기본 처리에 맡깁니다.
  return;
});
