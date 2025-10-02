import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { auth } from "@/services/firebase";

export default function DokumenUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return;
    setLoading(true);
    const path = `documents/${auth.currentUser.uid}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("documents").upload(path, file);
    if (error) { alert("Gagal upload"); setLoading(false); return; }
    await supabase.from("document_jobs").insert([{
      user_uid: auth.currentUser.uid, type: "review", status: "submitted",
      payload: { filename: file.name, size: file.size }, result_url: null
    }]);
    setLoading(false);
    alert("Dokumen terkirim. Menunggu pemeriksaan.");
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Pemeriksaan Dokumen</h1>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={upload} disabled={!file || loading}
        className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-xl">
        {loading ? "Mengunggah..." : "Kirim untuk diperiksa"}
      </button>
    </div>
  );
}
