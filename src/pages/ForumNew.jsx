import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function ForumNew() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("forum_threads").insert([
      {
        title,
        content,
        author: "Anonim", // nanti bisa diganti user login kalau ada auth
      },
    ]);

    if (error) {
      console.error("Gagal bikin thread:", error);
      alert("Gagal membuat diskusi ❌");
    } else {
      navigate("/forum");
    }

    setLoading(false);
  };

  return (
    <PageWrapper page="forum" title="Buat Diskusi">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Buat Diskusi Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Judul Diskusi</label>
            <input
              type="text"
              className="w-full border rounded-xl px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Contoh: Cara bikin PT sendiri"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Isi Diskusi</label>
            <textarea
              className="w-full border rounded-xl px-3 py-2"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Tulis pertanyaan atau topik yang ingin dibahas..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-xl font-medium hover:bg-red-700 transition"
          >
            {loading ? "Membuat..." : "Buat Diskusi"}
          </button>
        </form>

        <Link
          to="/forum"
          className="mt-6 inline-block text-red-600 font-medium hover:underline"
        >
          ← Kembali ke Forum
        </Link>
      </div>
    </PageWrapper>
  );
}
