import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, BookOpen, Users, LogOut, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userName");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  const menus = [
    { to: "/home", label: "Beranda", icon: <Home size={22} /> },
    { to: "/dokumen", label: "Dokumen", icon: <FileText size={22} /> },
    { to: "/artikel", label: "Artikel", icon: <BookOpen size={22} /> },
    { to: "/forum", label: "Forum", icon: <Users size={22} /> },
    { to: "/profile", label: "Profil", icon: <User size={22} /> }, // ✅ Tambahan Profile
  ];

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%]
      bg-white/70 backdrop-blur-md shadow-lg rounded-2xl
      flex justify-around items-center py-2 px-3 border border-white/20"
    >
      {menus.map((m) => {
        const active = pathname === m.to;
        return (
          <Link
            key={m.to}
            to={m.to}
            className={`flex flex-col items-center text-xs transition ${
              active ? "text-[#cc0000] font-semibold" : "text-gray-600"
            }`}
          >
            <div
              className={`p-1.5 rounded-full ${
                active ? "bg-[#cc0000]/10" : ""
              }`}
            >
              {m.icon}
            </div>
            {m.label}
          </Link>
        );
      })}

      {/* 🚪 Logout button */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-xs text-gray-500 hover:text-red-600 transition"
      >
        <div className="p-1.5 rounded-full hover:bg-gray-100/60">
          <LogOut size={22} />
        </div>
        Logout
      </button>
    </div>
  );
}
