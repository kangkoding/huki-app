import { Link } from "react-router-dom";

const templates = [
  { type: "kontrak-kerja", title: "Kontrak Kerja Sederhana" },
  { type: "perjanjian-kerjasama", title: "Perjanjian Kerjasama Usaha" },
  { type: "surat-somasi", title: "Surat Somasi" },
  { type: "surat-kuasa", title: "Surat Kuasa" },
];

export default function DokumenTemplates() {
  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Pembuatan Dokumen</h1>
      <div className="space-y-3">
        {templates.map(t => (
          <Link key={t.type} to={`/dokumen/generate/${t.type}`} className="block p-4 bg-white rounded-xl shadow">
            {t.title}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Link to="/dokumen/upload" className="block text-center bg-blue-600 text-white py-2 rounded-xl">
          Upload Dokumen untuk Pemeriksaan
        </Link>
      </div>
    </div>
  );
}
