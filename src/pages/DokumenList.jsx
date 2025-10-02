import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";
import { FileText } from "lucide-react";

export default function DokumenList() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal ambil dokumen:", error);
    } else {
      setDocs(data || []);
    }
    setLoading(false);
  }

  return (
    <PageWrapper page="dokumen" title="Dokumen Hukum">
      {loading ? (
        <p className="text-center text-gray-500">Memuat dokumen...</p>
      ) : docs.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada dokumen 😅</p>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              to={`/dokumen/${doc.id}`}
              className="flex items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{doc.title}</h2>
                <p className="text-xs text-gray-500">
                  {doc.category} •{" "}
                  {new Date(doc.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        to="/dokumen/upload"
        className="mt-6 block bg-blue-600 text-white py-2 rounded-xl font-medium text-center hover:bg-blue-700 transition"
      >
        + Upload Dokumen
      </Link>
    </PageWrapper>
  );
}
