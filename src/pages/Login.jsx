import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "@/services/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { supabase } from "@/services/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin/users", { replace: true });
        break;
      case "lawyer":
        navigate("/lawyer", { replace: true });
        break;
      default:
        navigate("/home", { replace: true });
        break;
    }
  };

  const fetchUserRole = async (uid) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", uid)
      .single();

    if (error) {
      console.error("❌ Gagal ambil role dari Supabase:", error);
      return null;
    }
    if (data?.role) {
      localStorage.setItem("role", data.role);
      return data.role;
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const role = await fetchUserRole(user.uid);
      if (role) {
        setTimeout(() => redirectByRole(role), 50);
        return;
      }
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        navigate("/home", { replace: true });
      } else {
        navigate("/complete-profile", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const { user } = await signInWithPopup(auth, provider);
      const role = await fetchUserRole(user.uid);
      if (role) {
        setTimeout(() => redirectByRole(role), 50);
        return;
      }
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          createdAt: new Date(),
        });
      }
      navigate("/complete-profile", { replace: true });
    } catch (err) {
      console.error("Google login error:", err);
      setError("Login Google gagal, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#cc0000] text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>{loading ? "Loading..." : "Login dengan Google"}</span>
          </button>
        </div>

        <p className="text-sm text-center mt-6">
          Belum punya akun?{" "}
          <Link to="/register" className="text-red-600 hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
