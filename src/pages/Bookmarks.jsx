import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { auth } from "@/services/firebase";
import { Link } from "react-router-dom";

export default function Bookmarks() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("bookmarks").select("*, articles(*)")
        .eq("user_uid", auth.currentUser.uid)
        .order("created_at", { ascending: false });
      setRows(data || []);
    })();
  }, []);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-3">Bookmark Saya</h1>
      <div className="space-y-3">
        {rows.map((r) => (
          <Link key={r.id} to={`/artikel-dinamis/${r.articles.slug}`} className="block p-4 bg-white rounded-xl shadow">
            {r.articles.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
