import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { auth } from "@/services/firebase";

export default function DokumenReview() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("document_jobs")
        .select("*")
        .eq("user_uid", auth.currentUser.uid)
        .order("created_at", { ascending: false });
      setRows(data || []);
    })();
  }, []);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Status Dokumen</h1>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="p-4 bg-white rounded-xl shadow">
            <div className="font-medium">{r.type}</div>
            <div className="text-sm text-gray-500">Status: {r.status}</div>
            {r.result_url && (
              <a className="text-blue-600 underline text-sm" href={r.result_url} target="_blank">
                Lihat hasil
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
