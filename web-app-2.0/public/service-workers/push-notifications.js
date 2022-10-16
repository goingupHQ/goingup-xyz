self.addEventListener('push', function (event) {
    if (event.data) {
        console.log('Push event has data: ', event.data.text());
        const data = event.data.json();
        const promiseChain = self.registration.showNotification(`GoingUP: ${data.title}`, {
            icon: '/images/goingup-glyph.png',
            badge: '/images/goingup-glyph.png',
            body: data.body,
            requireInteraction: true,
            tag: data.urlToOpen,
        });
        event.waitUntil(promiseChain);
    } else {
        console.log('This push event has no data.');
    }
});

self.addEventListener('notificationclick', function (event) {
    console.log('On notification click: ', event.notification);
    event.notification.close();
    if (event.notification.tag) {
        const urlToOpen = event.notification.tag;
        const promiseChain = clients.openWindow(urlToOpen);
        event.waitUntil(promiseChain);
    }
});
