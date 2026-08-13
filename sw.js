// Service Worker — Ingemaq Rastreo GPS
const CACHE_NAME = 'rastreo-gps-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Mantener activo en background
self.addEventListener('fetch', e => {
  // Dejar pasar todas las peticiones normalmente
  e.respondWith(fetch(e.request).catch(() => new Response('')));
});

// Manejar notificaciones push (cuando vienen del servidor)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || '⚠️ Registrá tus eventos', {
      body: data.body || 'Tu jefe te pide que registres tus eventos de hoy.',
      requireInteraction: true,
      icon: '/rastreo-chofer/icon-192.png',
      badge: '/rastreo-chofer/icon-192.png'
    })
  );
});

// Al tocar la notificación, abrir la app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Si la app ya está abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes('chofer') && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no está abierta, abrirla
      if (clients.openWindow) {
        return clients.openWindow('/rastreo-chofer/chofer.html');
      }
    })
  );
});
