import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    const channel = supabase
      .channel("profiles-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        fetchUsers
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchUsers() {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (search.trim()) {
      query = query.ilike("email", `%${search}%`);
    }

    const { data, error } = await query;
    setLoading(false);

    if (error) {
      console.error("Gagal fetch users:", error);
    } else {
      setUsers(data || []);
    }
  }

  async function handleRoleChange(id, newRole) {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id);

    if (error) {
      console.error("Gagal ubah role:", error);
      alert("Gagal ubah role ❌");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      console.error("Gagal hapus user:", error);
      alert("Gagal hapus user ❌");
    }
  }

  return (
    <PageWrapper page="admin-users" title="Kelola User">
      <div className="p-4 pb-24">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari email user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">Tidak ada user.</p>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{u.name || "Tanpa Nama"}</p>
                  <p className="text-sm text-gray-600">{u.email || "-"}</p>
                  <p className="text-xs text-gray-400">
                    Role: <span className="font-medium">{u.role}</span>
                  </p>
                  {u.role === "lawyer" && (
                    <>
                      <p className="text-xs text-gray-500">
                        Bidang: {u.specialization || "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Tarif: Rp {u.rate_per_session || 0}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="lawyer">Lawyer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
