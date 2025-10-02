import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { Link } from "react-router-dom";

export default function ArtikelDinamisList() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("articles").select("*").order("published_at", { ascending: false });
      setRows(data || []);
    })();
  }, []);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-3">Artikel & Edukasi</h1>
      <div className="space-y-3">
        {rows.map(a => (
          <Link key={a.id} to={`/artikel-dinamis/${a.slug}`} className="block p-4 bg-white rounded-xl shadow">
            <div className="font-semibold">{a.title}</div>
            <div className="text-xs text-gray-500 mt-1">{new Date(a.published_at).toLocaleDateString()}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
