export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: '/' })
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);

          // Forzar actualización del worker si hay una nueva versión
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New content available, please refresh.');
              }
            };
          };
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}
