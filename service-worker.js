const CACHE_NAME = 'feiracircular-v1';
const urlsToCache = [
  './index.html',
  './inicio.html',
  './ofertas.html',
  './cadastro.html',
  './doacoes.html',
  './painel.html',
  './CSS/index.css',
  './CSS/inicio.css',
  './CSS/ofertas.css',
  './CSS/cadastro.css',
  './CSS/doacoes.css',
  './CSS/painel.css',
  './JS/auth.js',
  './JS/index.js',
  './JS/inicio.js',
  './JS/ofertas.js',
  './JS/cadastro.js',
  './JS/doacoes.js',
  './JS/painel.js',
  './IMG/LogoSemFundo.png',
  './IMG/TresFolhas.png'
];

// Instala o Service Worker e salva os arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta as requisições: se estiver no cache, usa o cache. Senão, busca na internet.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna do cache
        }
        return fetch(event.request); // Busca na internet
      })
  );
});