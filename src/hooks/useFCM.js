import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "@/services/firebase";

export function useFCM() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    async function init() {
      try {
        const messaging = getMessaging(app);
        await Notification.requestPermission();
        await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
        console.log("FCM token", token);
        onMessage(messaging, (payload) => {
          console.log("FCM foreground:", payload);
        });
        setReady(true);
      } catch (e) {
        console.warn("FCM init failed:", e);
      }
    }
    init();
  }, []);
  return ready;
}
