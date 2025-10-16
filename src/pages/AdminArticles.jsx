import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchArticles();

    // Realtime update saat artikel berubah
    const channel = supabase
      .channel("articles-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "articles" },
        fetchArticles
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchArticles() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal fetch artikel:", error);
    } else {
      setArticles(data || []);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Judul dan konten tidak boleh kosong");
      return;
    }

    if (editingId) {
      // Update artikel
      const { error } = await supabase
        .from("articles")
        .update({ ...form, updated_at: new Date() })
        .eq("id", editingId);

      if (error) {
        console.error("Gagal update artikel:", error);
        alert("Gagal mengupdate artikel ❌");
      } else {
        resetForm();
      }
    } else {
      // Tambah artikel baru
      const { error } = await supabase
        .from("articles")
        .insert([{ ...form, created_at: new Date() }]);

      if (error) {
        console.error("Gagal tambah artikel:", error);
        alert("Gagal menambahkan artikel ❌");
      } else {
        resetForm();
      }
    }
  }

  function resetForm() {
    setForm({ title: "", content: "" });
    setEditingId(null);
  }

  function handleEdit(article) {
    setForm({ title: article.title, content: article.content });
    setEditingId(article.id);
  }

  async function handleDelete(id) {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      console.error("Gagal hapus artikel:", error);
      alert("Gagal menghapus artikel ❌");
    }
  }

  return (
    <PageWrapper page="admin-articles" title="Kelola Artikel">
      <div className="p-4 pb-24">
        {/* ✍️ Form Tambah/Edit */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-xl shadow space-y-3 mb-6"
        >
          <input
            type="text"
            placeholder="Judul Artikel"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Isi artikel..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm h-24"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingId ? "Simpan Perubahan" : "Tambah Artikel"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-2 text-gray-500 hover:underline text-sm"
            >
              Batal Edit
            </button>
          )}
        </form>

        {/* 📋 Daftar Artikel */}
        <div className="space-y-3">
          {articles.map((a) => (
            <div
              key={a.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-start"
            >
              <div>
                <h2 className="font-semibold text-lg">{a.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {a.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(a.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(a)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <p className="text-gray-500 text-sm">Belum ada artikel.</p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
