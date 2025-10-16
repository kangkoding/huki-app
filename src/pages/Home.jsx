import { Link } from "react-router-dom";
import { Search, History, BookOpen, Users, MessageSquare } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { supabase } from "@/services/supabaseClient";
import NotificationsBanner from "@/components/NotificationsBanner";

export default function Home() {
  const { user } = useFirebaseAuth();
  const [displayName, setDisplayName] = useState("");
  const [loadingName, setLoadingName] = useState(true);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchName();
  }, [user]);

  useEffect(() => {
    fetchArticles();
    // realtime listener artikel
    const channel = supabase
      .channel("home-articles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "articles" },
        fetchArticles
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchName() {
    if (!user) {
      setLoadingName(false);
      return;
    }

    try {
      if (user.displayName) {
        setDisplayName(user.displayName);
      } else {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setDisplayName(data?.name || data?.email || "Pengguna");
        } else {
          setDisplayName(user.email || "Pengguna");
        }
      }
    } finally {
      setLoadingName(false);
    }
  }

  async function fetchArticles() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error) setArticles(data || []);
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-[#cc0000] text-white p-6 rounded-b-3xl shadow-md">
        {loadingName ? (
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-white/30 rounded mb-2"></div>
            <div className="h-4 w-48 bg-white/20 rounded"></div>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold">
              Halo, {displayName || "Pengguna"} 👋
            </h1>
            <p className="text-sm text-white/80">
              Butuh bantuan hukum hari ini?
            </p>
          </>
        )}
      </div>

      {/* Search Bar */}
      {/* <div className="px-4 -mt-5">
        <div className="bg-white rounded-xl shadow flex items-center gap-2 px-4 py-2">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari layanan atau artikel hukum..."
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div> */}

      {/* Banner Notifikasi */}
      <div className="px-4 mt-4">
        <NotificationsBanner role="user" />
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-4 gap-4 px-4 mt-4">
        <Link to="/pilih-bidang" className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <MessageSquare className="text-[#cc0000]" size={28} />
          </div>
          <p className="text-xs mt-2 text-gray-700">Konsultasi</p>
        </Link>

        <Link to="/riwayat-transaksi" className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
            <History className="text-blue-500" size={28} />
          </div>
          <p className="text-xs mt-2 text-gray-700">Transaksi</p>
        </Link>

        <Link to="/artikel" className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <BookOpen className="text-green-500" size={28} />
          </div>
          <p className="text-xs mt-2 text-gray-700">Artikel</p>
        </Link>

        <Link to="/forum" className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
            <Users className="text-yellow-500" size={28} />
          </div>
          <p className="text-xs mt-2 text-gray-700">Forum</p>
        </Link>
      </div>

      {/* Banner Promo */}
      <div className="px-4 mt-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-5 rounded-2xl shadow-md">
          <h2 className="text-lg font-bold">Konsultasi Gratis untuk UMKM 🚀</h2>
          <p className="text-sm text-white/80 mt-1">
            Dapatkan sesi konsultasi hukum gratis terbatas bulan ini.
          </p>
        </div>
      </div>

      {/* Artikel Terbaru */}
      <div className="px-4 mt-6 mb-8">
        <h2 className="font-bold text-gray-800 mb-3">Artikel Terbaru</h2>
        <div className="space-y-3">
          {articles.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada artikel untuk saat ini.
            </p>
          ) : (
            articles.map((article) => (
              <Link
                key={article.id}
                to={`/artikel/${article.id}`}
                className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-800 text-sm">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
