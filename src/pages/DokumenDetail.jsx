import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";
import { FileText, Download } from "lucide-react";

export default function DokumenDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoc();
  }, [id]);

  async function fetchDoc() {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Gagal ambil dokumen:", error);
    } else {
      setDoc(data);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <PageWrapper page="dokumen">
        <div className="p-4 text-center text-gray-500">Memuat dokumen...</div>
      </PageWrapper>
    );
  }

  if (!doc) {
    return (
      <PageWrapper page="dokumen">
        <div className="p-4 text-center">
          <p className="text-gray-500">Dokumen tidak ditemukan ❌</p>
          <Link
            to="/dokumen"
            className="mt-4 inline-block text-blue-600 font-medium"
          >
            Kembali ke Dokumen
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper page="dokumen" title={doc.title}>
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">{doc.title}</h1>
            <p className="text-sm text-gray-500">{doc.category}</p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">{doc.description}</p>

        <a
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition"
        >
          <Download size={18} className="mr-2" />
          Unduh Dokumen
        </a>

        <Link
          to="/dokumen"
          className="mt-6 inline-block text-blue-600 font-medium hover:underline"
        >
          ← Kembali ke Dokumen
        </Link>
      </div>
    </PageWrapper>
  );
}
