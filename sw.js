// Define un nombre para la caché actual. Cambiar este nombre (p.ej., a v2)
// cuando actualices los archivos cacheados activará el ciclo de actualización.
const CACHE_NAME = 'dilution-calculator-v2';

// Lista de URLs (archivos) que forman el "App Shell" - lo mínimo
// necesario para que tu aplicación funcione offline.
const urlsToCache = [
  '/',             // La página principal (a menudo sirve index.html)
  '/index.html',   // El archivo HTML principal
  '/styles.css',   // La hoja de estilos
  '/app.js',       // El archivo JavaScript principal
  '/icon-192.png', // Icono para PWA (usado en manifest.json)
  '/icon-512.png'  // Icono para PWA (usado en manifest.json)
  // Asegúrate de que estas rutas sean correctas respecto a la ubicación del sw.js
  // Podrías necesitar añadir '/manifest.json' si quieres que funcione offline
];

// Evento 'install': Se dispara cuando el navegador registra el SW por primera vez
// o cuando detecta una nueva versión del archivo sw.js.
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  // event.waitUntil() retrasa la finalización de la instalación hasta
  // que la promesa que se le pasa se resuelva. Es crucial para asegurar
  // que la caché esté lista antes de que el SW se active.
  event.waitUntil(
    caches.open(CACHE_NAME) // Abre (o crea) la caché con el nombre especificado.
      .then(cache => {
        console.log('Service Worker: Cache abierta, añadiendo archivos del App Shell');
        // cache.addAll() toma una lista de URLs, las solicita a la red
        // y guarda las respuestas en la caché. Es atómico: si alguna URL
        // falla, ninguna se añade.
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Archivos del App Shell cacheados con éxito');
        // self.skipWaiting(); // Descomentar si quieres que el nuevo SW se active inmediatamente
      })
      .catch(error => {
        // Es importante capturar errores aquí para depuración.
        console.error('Service Worker: Falló el cacheo del App Shell durante la instalación', error);
      })
  );
});

// Evento 'fetch': Se dispara cada vez que la aplicación (página HTML, etc.)
// realiza una solicitud de red (fetch) para cualquier recurso (HTML, CSS, JS, imágenes, API...).
self.addEventListener('fetch', event => {
  // event.respondWith() intercepta la solicitud y permite al SW
  // proporcionar su propia respuesta.
  event.respondWith(
    // caches.match(event.request) busca una respuesta en caché que coincida
    // con la solicitud actual (compara URL, método, etc.).
    caches.match(event.request)
      .then(response => {
        // Si se encuentra una respuesta en caché (response no es null),
        // la devuelve directamente. Esta es la estrategia "Cache First".
        if (response) {
          console.log(`Service Worker: Sirviendo desde caché: ${event.request.url}`);
          return response;
        }
        // Si no se encuentra en caché, realiza la solicitud a la red.
        console.log(`Service Worker: Solicitando a la red: ${event.request.url}`);
        return fetch(event.request);
        // Nota: Este fetch también podría fallar si no hay red.
        // Podrías añadir un .catch() aquí para devolver una página offline genérica.
      })
      // (Opcional) Captura de errores de fetch (si la caché falla y la red también)
      // .catch(error => {
      //   console.error('Service Worker: Error al hacer fetch:', error);
      //   // Podrías devolver una respuesta offline genérica aquí
      //   // return caches.match('/offline.html'); // Necesitarías cachear 'offline.html'
      // })
  );
});

// --- MEJORA: Añadir limpieza de cachés antiguas ---
// Evento 'activate': Se dispara después de 'install' y cuando el SW
// toma control de la página. Es el lugar ideal para limpiar cachés antiguas.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  const cacheWhitelist = [CACHE_NAME]; // Solo queremos mantener la caché actual

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si la caché encontrada no está en nuestra lista blanca (es una versión antigua)
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`Service Worker: Eliminando caché antigua: ${cacheName}`);
            return caches.delete(cacheName); // La eliminamos
          }
        })
      );
    })
    // .then(() => self.clients.claim()) // Descomentar si quieres que el SW tome control inmediato de las pestañas abiertas
  );
});
