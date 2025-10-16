import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

/**
 * Komponen Banner Notifikasi Reusable
 * @param {string} role - role target banner, contoh: "user", "lawyer", "admin"
 */
export default function NotificationsBanner({ role = "user" }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();

    // 🔄 Realtime listener supaya banner auto update
    const channel = supabase
      .channel(`notifications-${role}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        fetchNotifications
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role]);

  async function fetchNotifications() {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .or(`role_target.eq.${role},role_target.is.null`)
      .order("created_at", { ascending: false });

    if (!error) setNotifications(data || []);
  }

  if (notifications.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-4 py-2 rounded-lg shadow-sm"
        >
          <strong>{n.title}</strong>
          <p className="text-sm">{n.message}</p>
        </div>
      ))}
    </div>
  );
}
