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
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "lawyer") navigate("/lawyer");
    else navigate("/home");
  };

  const ensureProfile = async (user) => {
    // kalau belum ada di profiles → buat role default user
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.uid)
      .single();
    if (!data) {
      await supabase.from("profiles").insert([
        {
          id: user.uid,
          email: user.email,
          role: "user",
          name: user.displayName || null,
        },
      ]);
      localStorage.setItem("role", "user");
      return "user";
    } else {
      localStorage.setItem("role", data.role || "user");
      return data.role || "user";
    }
  };

  const afterAuth = async (user) => {
    // jaga kompatibilitas: buat doc dasar di Firestore kalau belum ada
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });
    }
    const role = await ensureProfile(user);
    redirectByRole(role);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await afterAuth(res.user);
    } catch (err) {
      console.error(err);
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider());
      await afterAuth(res.user);
    } catch (err) {
      console.error(err);
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
            className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
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
