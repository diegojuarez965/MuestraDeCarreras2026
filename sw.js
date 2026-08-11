const CACHE_NAME = 'muestra-carreras-cache-v1';
const ASSETS = [
  './',
  'index-muestra.html',
  'actividades.html',
  'css/estilo-muestra.css',
  'js/propuestas.js',
  'js/buscador.js',
  'js/contador.js',
  'js/menu.js',
  'components/navegador.js',
  'components/pie-pagina.js',
  'img/cartelera.png',
  'img/correo.jpeg',
  'img/cronograma.png',
  'img/instagram.jpeg',
  'img/isotipo.jpeg',
  'img/logo70.png',
  'img/logos.png',
  'img/mic-responsive.png',
  'img/mic-texto.png',
  'img/muestra.png'
];

// Instalar el Service Worker y pre-cachear los recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-cacheando recursos del sitio...');
        return Promise.allSettled(
          ASSETS.map((asset) => {
            return cache.add(asset)
              .catch((err) => {
                console.error(`[Service Worker] Error al cachear "${asset}":`, err);
              });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activar y limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar peticiones con estrategia Network-First
self.addEventListener('fetch', (event) => {
  // Solo interceptamos peticiones GET con esquemas http o https
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la respuesta es válida y del mismo origen (o CORS correcto), la guardamos en la caché
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch((error) => {
        console.log('[Service Worker] Falla de red, buscando en caché:', event.request.url, error);
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Si no está en caché, y es un HTML de navegación, intentamos mostrar index-muestra.html
            if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
              return caches.match('index-muestra.html');
            }
          });
      })
  );
});
