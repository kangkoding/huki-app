import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  MessageSquareText,
  LayoutDashboard,
  LogOut,
  User,
  Briefcase,
  Shield,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  let menus = [];

  if (role === "lawyer") {
    menus = [
      { to: "/lawyer", label: "Klien", icon: <Briefcase size={22} /> },
      { to: "/lawyer/profile", label: "Profil", icon: <User size={22} /> },
    ];
  } else if (role === "admin") {
    menus = [
      {
        to: "/admin/dashboard",
        label: "Home",
        icon: <LayoutDashboard size={22} />,
      },
      { to: "/admin/users", label: "Users", icon: <Shield size={22} /> },
      { to: "/profile", label: "Profil", icon: <User size={22} /> },
    ];
  } else {
    menus = [
      { to: "/home", label: "Beranda", icon: <Home size={22} /> },
      {
        to: "/riwayat-chat",
        label: "Pesan",
        icon: <MessageSquareText size={22} />,
      },
      { to: "/profile", label: "Profil", icon: <User size={22} /> },
    ];
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] 
      bg-white/80 backdrop-blur-md shadow-lg rounded-2xl 
      flex justify-around items-center py-2 px-3 border border-white/20 z-50"
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
