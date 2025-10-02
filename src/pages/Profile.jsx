import { useEffect, useState } from "react";
import { auth, db } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setProfile(snap.data());
        }
      } catch (err) {
        console.error("Gagal load profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), {
        ...profile,
        updatedAt: new Date(),
      });

      alert("Profil berhasil diperbarui ✅");
    } catch (err) {
      console.error("Error update profil:", err);
      alert("Gagal memperbarui profil ❌");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Profil tidak ditemukan</p>
      </div>
    );
  }

  const user = auth.currentUser;

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-24 flex justify-center items-start">
      {/* ✅ pb-24 = padding bawah biar nggak ketutupan BottomNav */}
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md mt-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Profil Usaha
        </h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src={user?.photoURL || "https://placehold.co/100"}
            alt="Profile"
            className="w-20 h-20 rounded-full mb-2"
          />
          <p className="font-medium">{user?.email}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap..."
              className="w-full border rounded-lg px-3 py-2"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Nama Usaha</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={profile.namaUsaha || ""}
              onChange={(e) =>
                setProfile({ ...profile, namaUsaha: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Jenis Usaha</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={profile.jenisUsaha || ""}
              onChange={(e) =>
                setProfile({ ...profile, jenisUsaha: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Alamat</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2"
              value={profile.alamat || ""}
              onChange={(e) =>
                setProfile({ ...profile, alamat: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Skala Usaha</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={profile.skalaUsaha || "mikro"}
              onChange={(e) =>
                setProfile({ ...profile, skalaUsaha: e.target.value })
              }
            >
              <option value="mikro">Mikro</option>
              <option value="kecil">Kecil</option>
              <option value="menengah">Menengah</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}
