import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";
import {
  Newspaper,
  Users,
  Scale,
  UserCog,
  Bell,
  BadgeDollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    users: 0,
    lawyers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      // Hitung jumlah artikel
      const { count: articleCount } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true });

      // Hitung jumlah user
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Hitung jumlah lawyer
      const { count: lawyerCount } = await supabase
        .from("lawyers")
        .select("*", { count: "exact", head: true });

      setStats({
        articles: articleCount || 0,
        users: userCount || 0,
        lawyers: lawyerCount || 0,
      });
    } catch (err) {
      console.error("Gagal ambil statistik:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Statistik */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
            <Newspaper className="text-blue-600 mb-2" size={28} />
            <p className="text-xl font-bold">{stats.articles}</p>
            <p className="text-sm text-gray-600">Artikel</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
            <Users className="text-green-600 mb-2" size={28} />
            <p className="text-xl font-bold">{stats.users}</p>
            <p className="text-sm text-gray-600">User</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
            <Scale className="text-red-600 mb-2" size={28} />
            <p className="text-xl font-bold">{stats.lawyers}</p>
            <p className="text-sm text-gray-600">Lawyer</p>
          </div>
        </div>
      )}

      {/* Menu Aksi Admin */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Menu Admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="flex items-center gap-3 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <UserCog className="text-blue-600" size={24} />
            <div>
              <p className="font-semibold">Kelola User</p>
              <p className="text-sm text-gray-500">Tambah, ubah, hapus user</p>
            </div>
          </Link>

          <Link
            to="/admin/lawyers"
            className="flex items-center gap-3 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <Scale className="text-red-600" size={24} />
            <div>
              <p className="font-semibold">Kelola Lawyer</p>
              <p className="text-sm text-gray-500">
                Tambah, ubah, hapus data lawyer
              </p>
            </div>
          </Link>

          <Link
            to="/admin/articles"
            className="flex items-center gap-3 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <Newspaper className="text-green-600" size={24} />
            <div>
              <p className="font-semibold">Kelola Artikel</p>
              <p className="text-sm text-gray-500">
                Buat dan kelola artikel edukasi
              </p>
            </div>
          </Link>

          <Link
            to="/admin/notifications"
            className="flex items-center gap-3 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <Bell className="text-green-600" size={24} />
            <div>
              <p className="font-semibold">Kelola Notifikasi</p>
              <p className="text-sm text-gray-500">
                Buat dan kelola notifikasi
              </p>
            </div>
          </Link>

          <Link
            to="/admin/transactions"
            className="flex items-center gap-3 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <BadgeDollarSign className="text-blue-600" size={24} />
            <div>
              <p className="font-semibold">Kelola Transaksi</p>
              <p className="text-sm text-gray-500">Buat dan kelola transaksi</p>
            </div>
          </Link>

          <Link
            to="/admin/transactions"
            className="flex items-center gap-3 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <BadgeDollarSign className="text-green-600" size={24} />
            <div>
              <p className="font-semibold"></p>
              <p className="text-sm text-gray-500"></p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
