import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { auth } from "@/services/firebase";

export default function DokumenGenerate() {
  const { type } = useParams();
  const nav = useNavigate();
  const [v, setV] = useState({ namaPekerja: "", posisi: "", gaji: "", tanggal: "" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("document_jobs").insert([{
      user_uid: auth.currentUser.uid,
      type,
      status: "submitted",
      payload: v
    }]);
    setSaving(false);
    nav("/dokumen/review");
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Buat: {type}</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Nama Pekerja"
          value={v.namaPekerja} onChange={e=>setV({...v, namaPekerja:e.target.value})}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Posisi"
          value={v.posisi} onChange={e=>setV({...v, posisi:e.target.value})}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Gaji per bulan"
          value={v.gaji} onChange={e=>setV({...v, gaji:e.target.value})}/>
        <input type="date" className="w-full border rounded px-3 py-2"
          value={v.tanggal} onChange={e=>setV({...v, tanggal:e.target.value})}/>
        <button disabled={saving} className="w-full bg-red-600 text-white py-2 rounded-xl">
          {saving ? "Menyimpan..." : "Kirim untuk Diproses"}
        </button>
      </form>
    </div>
  );
}
