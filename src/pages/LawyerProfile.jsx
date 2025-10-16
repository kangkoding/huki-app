// src/pages/LawyerProfile.jsx
import { useEffect, useState } from "react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { supabase } from "@/services/supabaseClient";

export default function LawyerProfile() {
  const { user } = useFirebaseAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    firm: "",
    specialization: "",
    experience_years: "",
    clients_handled: "",
    rate_per_session: "",
    photo_url: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLawyerProfile();
    }
  }, [user]);

  async function fetchLawyerProfile() {
    setLoading(true);
    const { data, error } = await supabase
      .from("lawyers")
      .select("*")
      .eq("id", user.uid)
      .single();
    setLoading(false);

    if (error) {
      console.error("Gagal ambil profil lawyer:", error);
      return;
    }

    if (data) {
      setForm({
        name: data.name || "",
        email: data.email || "",
        firm: data.firm || "",
        specialization: data.specialization || "",
        experience_years: data.experience_years || "",
        clients_handled: data.clients_handled || "",
        rate_per_session: data.rate_per_session || "",
        photo_url: data.photo_url || "",
        bio: data.bio || "",
      });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      experience_years: Number(form.experience_years) || 0,
      clients_handled: Number(form.clients_handled) || 0,
      rate_per_session: Number(form.rate_per_session) || 0,
    };

    const { error } = await supabase
      .from("lawyers")
      .update(payload)
      .eq("id", user.uid);

    setSaving(false);

    if (error) {
      console.error("Gagal update profil lawyer:", error);
      alert("Gagal menyimpan profil ❌");
    } else {
      alert("✅ Profil berhasil diperbarui");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">👨‍⚖️ Profil Lawyer</h1>

      <form onSubmit={handleSave} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Nama"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          disabled
          className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
        />

        <input
          type="text"
          name="firm"
          placeholder="Firma Hukum"
          value={form.firm}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <input
          type="text"
          name="specialization"
          placeholder="Spesialisasi"
          value={form.specialization}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="experience_years"
            placeholder="Pengalaman (tahun)"
            value={form.experience_years}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="clients_handled"
            placeholder="Jumlah Klien"
            value={form.clients_handled}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <input
          type="number"
          name="rate_per_session"
          placeholder="Tarif per sesi (Rp)"
          value={form.rate_per_session}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <input
          type="text"
          name="photo_url"
          placeholder="URL Foto Profil"
          value={form.photo_url}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <textarea
          name="bio"
          placeholder="Bio / Deskripsi singkat"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
