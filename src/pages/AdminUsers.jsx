import { useEffect, useRef, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export default function AdminUsers() {
  const { user } = useFirebaseAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const pageSize = 15;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchUsers(1, true);

    const channel = supabase
      .channel("profiles-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => handleRealtimeChange(payload)
      )
      .subscribe((status) => {
        console.log("📡 AdminUsers realtime status:", status);
      });

    return () => {
      setTimeout(() => {
        supabase.removeChannel(channel);
      }, 300);
    };
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchUsers(page + 1, false);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, page, hasMore, loading]);

  async function fetchUsers(pageNumber = 1, replace = false) {
    setLoading(true);

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("email", { ascending: true })
      .range(start, end);

    if (error) {
      console.error("Gagal ambil users:", error);
    } else {
      if (replace) {
        setUsers(data || []);
      } else {
        setUsers((prev) => [...prev, ...(data || [])]);
      }

      if (!data || data.length < pageSize) {
        setHasMore(false);
      } else {
        setPage(pageNumber);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
    } else {
      const lower = search.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.email?.toLowerCase().includes(lower) ||
            u.id?.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, users]);

  async function handleChangeRole(userId, newRole) {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      console.error("Gagal update role:", error);
      alert("Gagal mengubah role ❌");
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
  }

  async function handleDeleteUser(userId, email) {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus user "${email}"?`
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) {
      console.error("Gagal hapus user:", error);
      alert("Gagal menghapus user ❌");
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  }

  function handleRealtimeChange(payload) {
    if (payload.eventType === "INSERT") {
      setUsers((prev) => [payload.new, ...prev]);
    }
    if (payload.eventType === "UPDATE") {
      setUsers((prev) =>
        prev.map((u) => (u.id === payload.new.id ? payload.new : u))
      );
    }
    if (payload.eventType === "DELETE") {
      setUsers((prev) => prev.filter((u) => u.id !== payload.old.id));
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">👑 Admin - Kelola Role User</h1>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan email atau UID..."
          className="w-full md:w-1/2 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      {filteredUsers.length === 0 && !loading ? (
        <p className="text-gray-500">Tidak ada user ditemukan.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm">Email</th>
                <th className="px-4 py-2 text-left text-sm">UID</th>
                <th className="px-4 py-2 text-left text-sm">Role</th>
                <th className="px-4 py-2 text-left text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2 text-sm">{u.email}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">{u.id}</td>
                  <td className="px-4 py-2 text-sm font-medium">
                    {u.role || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-2 space-x-2 flex items-center">
                    <select
                      value={u.role || ""}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Pilih...</option>
                      <option value="user">User</option>
                      <option value="lawyer">Lawyer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(u.id, u.email)}
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {hasMore && (
            <div
              ref={loaderRef}
              className="py-4 text-center text-gray-400 text-sm"
            >
              {loading
                ? "Memuat data..."
                : "Scroll untuk memuat lebih banyak..."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
