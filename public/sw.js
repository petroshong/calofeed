const CACHE_NAME = 'calofeed-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for offline meal logging
self.addEventListener('sync', (event) => {
  if (event.tag === 'meal-sync') {
    event.waitUntil(syncMeals());
  }
});

async function syncMeals() {
  // Get offline meals from IndexedDB and sync to server
  const offlineMeals = await getOfflineMeals();
  
  for (const meal of offlineMeals) {
    try {
      await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meal)
      });
      
      // Remove from offline storage after successful sync
      await removeOfflineMeal(meal.id);
    } catch (error) {
      console.error('Failed to sync meal:', error);
    }
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New activity on CaloFeed!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CaloFeed', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for IndexedDB operations
async function getOfflineMeals() {
  // Implementation would use IndexedDB to get offline meals
  return [];
}

async function removeOfflineMeal(mealId) {
  // Implementation would remove meal from IndexedDB
}