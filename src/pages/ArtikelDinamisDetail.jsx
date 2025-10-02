import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { auth } from "@/services/firebase";

export default function ArtikelDinamisDetail() {
  const { slug } = useParams();
  const [a, setA] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("articles").select("*").eq("slug", slug).single();
      setA(data || null);
    })();
  }, [slug]);

  if (!a) return <div className="p-4">Memuat...</div>;

  async function addBookmark() {
    setSaving(true);
    await supabase.from("bookmarks").insert([{ user_uid: auth.currentUser.uid, article_id: a.id }]);
    setSaving(false);
    alert("Disimpan ke bookmark");
  }

  function shareWA() {
    const text = encodeURIComponent(`${a.title} – ${location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold">{a.title}</h1>
      {a.cover_url && <img src={a.cover_url} alt="" className="my-3 rounded-xl" />}
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: a.content }} />
      <div className="mt-4 flex gap-2">
        <button onClick={addBookmark} disabled={saving}
          className="bg-yellow-500 text-white px-3 py-1 rounded">Bookmark</button>
        <button onClick={shareWA}
          className="bg-green-600 text-white px-3 py-1 rounded">Share WA</button>
      </div>
    </div>
  );
}
