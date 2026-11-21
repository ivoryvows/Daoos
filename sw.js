
self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "DAOOS", body: "You have a new notification." };
  }

  const title = data.title || "DAOOS";
  const options = {
    body: data.body || "You have a new notification.",
    icon: "/Daoos/icon-192.png",
    badge: "/Daoos/icon-192.png",
    data: {
      url: data.url || "/Daoos/",
      type: data.type || "message",
      conversation_id: data.conversation_id || null
    },
    tag: data.tag || "daoos-notification",
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
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
    }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.startsWith(self.location.origin + "/Daoos/")) {
          return client.focus().then(() => client.navigate(target));
        }
      }
      return clients.openWindow(target);
    })
  );
});
