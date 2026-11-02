/* BLACKOUT offline app shell, no network services required by gameplay. */
const CACHE="blackout-the-last-alibi-v12";
const APP_SHELL=["./","./index.html","./styles.css","./src/app.js","./src/engine.js","./src/chapter2-art.js","./src/chapter3.js","./src/chapter3-art.js","./src/chapter4.js","./src/chapter4-art.js","./src/chapter5.js","./src/chapter5-art.js","./src/chapter6.js","./src/chapter6-art.js","./src/chapter7.js","./src/chapter7-art.js","./src/chapter8.js","./src/chapter8-art.js","./src/chapter9.js","./src/chapter9-art.js","./src/chapter10.js","./src/chapter10-art.js","./src/chapter11.js","./src/chapter11-art.js","./src/chapter12.js","./src/chapter12-art.js"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
