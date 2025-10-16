import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import PageWrapper from "@/components/layouts/PageWrapper";
import emailjs from "emailjs-com";

const DEFAULT_PASSWORD = "lawyer12345";

export default function AdminLawyers() {
  const [lawyers, setLawyers] = useState([]);
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
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    fetchLawyers();
    const channel = supabase
      .channel("lawyers-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lawyers" },
        fetchLawyers
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchLawyers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("lawyers")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      console.error("Gagal fetch lawyers:", error);
    } else {
      setLawyers(data || []);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Nama dan Email wajib diisi!");
      return;
    }

    try {
      // 1️⃣ Buat akun Firebase otomatis
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        DEFAULT_PASSWORD
      );
      const lawyerUid = userCred.user.uid;
      console.log("✅ Akun lawyer Firebase dibuat:", lawyerUid);

      // 2️⃣ Simpan ke tabel lawyers
      const payload = {
        id: lawyerUid,
        name: form.name,
        email: form.email,
        firm: form.firm || "",
        specialization: form.specialization || "",
        experience_years: Number(form.experience_years) || 0,
        clients_handled: Number(form.clients_handled) || 0,
        rate_per_session: Number(form.rate_per_session) || 0,
        photo_url: form.photo_url || "",
        bio: form.bio || "",
      };

      const { error } = await supabase.from("lawyers").insert([payload]);
      if (error) throw error;

      // 3️⃣ Kirim email welcome
      await sendWelcomeEmail(form.name, form.email, DEFAULT_PASSWORD);

      alert(
        `✅ Lawyer berhasil ditambahkan!\nEmail: ${form.email}\nPassword: ${DEFAULT_PASSWORD}`
      );

      resetForm();
    } catch (err) {
      console.error("Gagal tambah lawyer:", err);
      alert("Gagal menambahkan lawyer ❌ " + err.message);
    }
  }

  async function handleEdit(lawyer) {
    setEditingId(lawyer.id);
    setForm({
      name: lawyer.name,
      email: lawyer.email || "",
      firm: lawyer.firm || "",
      specialization: lawyer.specialization || "",
      experience_years: lawyer.experience_years || "",
      clients_handled: lawyer.clients_handled || "",
      rate_per_session: lawyer.rate_per_session || "",
      photo_url: lawyer.photo_url || "",
      bio: lawyer.bio || "",
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingId) return;

    const payload = {
      name: form.name,
      email: form.email,
      firm: form.firm,
      specialization: form.specialization,
      experience_years: Number(form.experience_years) || 0,
      clients_handled: Number(form.clients_handled) || 0,
      rate_per_session: Number(form.rate_per_session) || 0,
      photo_url: form.photo_url,
      bio: form.bio,
    };

    const { error } = await supabase
      .from("lawyers")
      .update(payload)
      .eq("id", editingId);

    if (error) {
      console.error(error);
      alert("Gagal update lawyer ❌");
      return;
    }

    alert("✅ Data lawyer berhasil diperbarui");
    setEditingId(null);
    resetForm();
  }

  async function handleDelete(id) {
    if (!confirm("Yakin ingin menghapus lawyer ini?")) return;
    const { error } = await supabase.from("lawyers").delete().eq("id", id);
    if (error) {
      console.error(error);
      alert("Gagal hapus lawyer ❌");
    } else {
      alert("✅ Lawyer berhasil dihapus");
    }
  }

  async function sendWelcomeEmail(name, email, password) {
    try {
      await emailjs.send(
        "service_3kflay8", // ⚡ Ganti
        "template_q2zdiao", // ⚡ Ganti
        {
          to_name: name,
          to_email: email,
          login_email: email,
          login_password: password,
        },
        "Qq65mwJG5iNMcpaZF" // ⚡ Ganti
      );
      console.log("📨 Email berhasil dikirim ke", email);
    } catch (err) {
      console.error("Gagal kirim email:", err);
    }
  }

  function resetForm() {
    setForm({
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
  }

  return (
    <PageWrapper page="admin-lawyers" title="Kelola Lawyer">
      <div className="p-4 pb-24">
        {/* Form Tambah / Edit */}
        <form
          onSubmit={editingId ? handleUpdate : handleSubmit}
          className="space-y-3 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="name"
              placeholder="Nama Lawyer"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Lawyer (Gmail)"
              value={form.email}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
            {/* <input
              type="text"
              name="firm"
              placeholder="Firma Hukum"
              value={form.firm}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            /> */}
            <input
              type="text"
              name="specialization"
              placeholder="Spesialisasi"
              value={form.specialization}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              name="experience_years"
              placeholder="Pengalaman (tahun)"
              value={form.experience_years}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
            {/* <input
              type="number"
              name="clients_handled"
              placeholder="Jumlah Klien"
              value={form.clients_handled}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            /> */}
            <input
              type="number"
              name="rate_per_session"
              placeholder="Tarif per sesi (Rp)"
              value={form.rate_per_session}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
            {/* <input
              type="text"
              name="photo_url"
              placeholder="URL Foto Profil"
              value={form.photo_url}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            /> */}
          </div>

          <textarea
            name="bio"
            placeholder="Bio / Deskripsi Singkat"
            value={form.bio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Simpan Perubahan" : "Tambah Lawyer"}
          </button>
        </form>

        {/* Daftar Lawyer */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : lawyers.length === 0 ? (
          <p className="text-gray-500">Belum ada data lawyer.</p>
        ) : (
          <div className="space-y-3">
            {lawyers.map((l) => (
              <div
                key={l.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">{l.name}</p>
                  <p className="text-sm text-gray-600">{l.specialization}</p>
                  <p className="text-xs text-gray-400">
                    Pengalaman: {l.experience_years} Tahun • Klien:{" "}
                    {l.clients_handled}
                  </p>
                  <p className="text-xs text-gray-400">
                    Tarif: Rp {l.rate_per_session?.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(l)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
