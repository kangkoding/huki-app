import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [roleTarget, setRoleTarget] = useState("all");
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
  }

  async function handleSend(e) {
    e.preventDefault();
    await supabase
      .from("notifications")
      .insert([{ title, message, role_target: roleTarget }]);
    setTitle("");
    setMessage("");
    setRoleTarget("all");
    load();
  }

  return (
    <PageWrapper page="admin-notifications" title="Kelola Notifikasi">
      <div className="p-4 pb-24">
        <h1 className="text-xl font-bold mb-4">Kirim Notifikasi</h1>

        <form onSubmit={handleSend} className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            placeholder="Pesan notifikasi..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded px-3 py-2 h-20"
          />
          <select
            value={roleTarget}
            onChange={(e) => setRoleTarget(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="all">Semua</option>
            <option value="user">User</option>
            <option value="lawyer">Lawyer</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Kirim
          </button>
        </form>

        {items.map((n) => (
          <div key={n.id} className="bg-white p-3 rounded-xl shadow mb-2">
            <div className="font-semibold">{n.title}</div>
            <div className="text-sm text-gray-600">{n.message}</div>
            <div className="text-xs text-gray-400">
              Target: {n.role_target} |{" "}
              {new Date(n.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
