import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function CompleteProfile() {
  const [namaUsaha, setNamaUsaha] = useState("");
  const [jenisUsaha, setJenisUsaha] = useState("");
  const [alamat, setAlamat] = useState("");
  const [skalaUsaha, setSkalaUsaha] = useState("mikro");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User tidak ditemukan");

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          namaUsaha,
          jenisUsaha,
          alamat,
          skalaUsaha,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan profil");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Lengkapi Profil Usaha
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nama Usaha</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={namaUsaha}
              onChange={(e) => setNamaUsaha(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Jenis Usaha</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={jenisUsaha}
              onChange={(e) => setJenisUsaha(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Alamat</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Skala Usaha</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={skalaUsaha}
              onChange={(e) => setSkalaUsaha(e.target.value)}
            >
              <option value="mikro">Mikro</option>
              <option value="kecil">Kecil</option>
              <option value="menengah">Menengah</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Menyimpan..." : "Simpan & Lanjut"}
          </button>
        </form>
      </div>
    </div>
  );
}
