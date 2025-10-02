import { Link } from "react-router-dom";
import { Search, FileText, BookOpen, Users, MessageSquare } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export default function Home() {
  const { user } = useFirebaseAuth();
  const [displayName, setDisplayName] = useState("");
  const [loadingName, setLoadingName] = useState(true);

  // 🧠 Ambil nama user (localStorage → Firestore)
  useEffect(() => {
    async function fetchName() {
      if (user) {
        const localName = localStorage.getItem("userName");
        if (localName) {
          setDisplayName(localName);
          setLoadingName(false);
          return;
        }

        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            const data = snap.data();
            const name =
              data?.namaLengkap || data?.name || data?.email || "Pengguna";
            setDisplayName(name);

            if (data?.namaLengkap) {
              localStorage.setItem("userName", data.namaLengkap);
            }
          } else {
            setDisplayName(user.email || "Pengguna");
          }
        } catch (err) {
          console.error("Gagal fetch nama user:", err);
          setDisplayName(user.email || "Pengguna");
        } finally {
          setLoadingName(false);
        }
      } else {
        setLoadingName(false);
      }
    }

    fetchName();
  }, [user]);

  // 🌀 Listener untuk update nama real-time dari Profile.jsx
  useEffect(() => {
    function handleStorageChange(e) {
      if (e.key === "userName") {
        setDisplayName(e.newValue || "Pengguna");
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
      <div className="px-4 -mt-5">
        <div className="bg-white rounded-xl shadow flex items-center gap-2 px-4 py-2">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari layanan atau artikel hukum..."
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-4 gap-4 px-4 mt-6">
        <Link to="/konsultasi" className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <MessageSquare className="text-[#cc0000]" size={28} />
          </div>
          <p className="text-xs mt-2 text-gray-700">Konsultasi</p>
        </Link>

        <Link to="/dokumen" className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="text-blue-500" size={28} />
          </div>
          <p className="text-xs mt-2 text-gray-700">Dokumen</p>
        </Link>

        <Link to="/artikel" className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <BookOpen className="text-green-500" size={28} />
          </div>
          <p className="text-xs mt-2 text-gray-700">Edukasi</p>
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
      <div className="px-4 mt-6">
        <h2 className="font-bold text-gray-800 mb-3">Artikel Terbaru</h2>
        <div className="space-y-3">
          <Link
            to="/artikel/1"
            className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-800 text-sm">
              Panduan Hukum Usaha Mikro
            </h3>
            <p className="text-xs text-gray-500 mt-1">21 Sep 2025</p>
          </Link>
          <Link
            to="/artikel/2"
            className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-800 text-sm">
              Cara Membuat Kontrak Sederhana
            </h3>
            <p className="text-xs text-gray-500 mt-1">18 Sep 2025</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
