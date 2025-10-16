import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { auth } from "@/services/firebase";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function ForumNew() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const { error } = await supabase.from("forum_threads").insert([
      {
        title,
        content,
        user_id: user.uid,
      },
    ]);

    if (!error) {
      navigate("/forum");
    }
  }

  return (
    <PageWrapper page="forum" title="Buat Diskusi Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Judul Diskusi"
          className="w-full border rounded-lg px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Tulis isi diskusi..."
          className="w-full border rounded-lg px-3 py-2 h-32"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Posting Diskusi
        </button>
      </form>
    </PageWrapper>
  );
}
