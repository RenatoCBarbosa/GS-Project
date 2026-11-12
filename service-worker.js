const CACHE_NAME = 'feiracircular-v6';
const urlsToCache = [
  './index.html',
  './inicio.html',
  './ofertas.html',
  './cadastro.html',
  './cadastro-usuario.html',
  './doacoes.html',
  './painel.html',
  './painel-usuario.html',
  './localizador.html',
  './integrantes.html',
  './sobre.html',
  './faq.html',
  './contato.html',
  './CSS/style.css',
  './CSS/inicio.css',
  './CSS/ofertas.css',
  './CSS/cadastro.css',
  './CSS/cadastro-usuario.css',
  './CSS/doacoes.css',
  './CSS/painel.css',
  './CSS/painel-usuario.css',
  './CSS/localizador.css',
  './CSS/navegacao.css',
  './CSS/integrantes.css',
  './CSS/sobre.css',
  './CSS/faq.css',
  './CSS/contato.css',
  './JS/auth.js',
  './JS/script.js',
  './JS/inicio.js',
  './JS/ofertas.js',
  './JS/cadastro.js',
  './JS/cadastro-usuario.js',
  './JS/doacoes.js',
  './JS/painel.js',
  './JS/painel-usuario.js',
  './JS/localizador.js',
  './JS/faq.js',
  './JS/contato.js',
  './JS/sobre.js',
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
      .then(() => self.skipWaiting())
  );
});

// Intercepta as requisições: se estiver no cache, usa o cache. Senão, busca na internet.
// Remove versões antigas do cache e assume as páginas abertas com a versão atualizada.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(chaves => Promise.all(
        chaves.filter(chave => chave.startsWith('feiracircular-') && chave !== CACHE_NAME)
          .map(chave => caches.delete(chave))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => cache.match(event.request))
      .then(response => {
        if (response) {
          return response; // Retorna do cache
        }
        return fetch(event.request); // Busca na internet
      })
  );
});