
self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "DAOOS", {
      body: data.body || "You have a new notification.",
      icon: "/Daoos/icon-192.png",
      badge: "/Daoos/icon-192.png",
      tag: data.tag || "daoos-notification",
      renotify: true,
      data: {
        url: data.url || "/Daoos/",
        type: data.type || "message",
        call_id: data.call_id || null,
        conversation_id: data.conversation_id || null
      }
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const target = new URL(
    event.notification.data?.url || "/Daoos/",
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(async windows => {
      for (const client of windows) {
        if (client.url.startsWith(self.location.origin + "/Daoos/")) {
          await client.focus();
          return client.navigate(target);
        }
      }
      return clients.openWindow(target);
    })
  );
});
