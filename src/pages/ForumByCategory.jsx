import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { Link, useParams } from "react-router-dom";

export default function ForumByCategory() {
  const { categoryId } = useParams();
  const [threads, setThreads] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("forum_threads").select("*").eq("category_id", categoryId).order("created_at", { ascending: false });
      setThreads(data || []);
    })();
  }, [categoryId]);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-3">Forum Kategori</h1>
      <div className="space-y-3">
        {threads.map(t => (
          <Link key={t.id} to={`/forum/${t.id}`} className="block p-4 bg-white rounded-xl shadow">
            <div className="font-semibold">{t.title}</div>
            <div className="text-xs text-gray-500">{new Date(t.created_at).toLocaleString()}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
