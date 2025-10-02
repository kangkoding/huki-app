import { useParams, Link } from "react-router-dom";
import PageWrapper from "@/components/layouts/PageWrapper";

const dummyArticles = {
  1: {
    title: "Panduan Hukum Usaha Mikro",
    date: "21 Sep 2025",
    content:
      "Usaha mikro wajib memiliki dasar hukum agar kegiatan usaha berjalan lancar. Dokumen yang perlu disiapkan antara lain NIB, SIUP, dan NPWP. Dengan memiliki legalitas, UMKM dapat lebih mudah mengakses pendanaan, memperluas pasar, serta melindungi diri dari sengketa hukum.",
  },
  2: {
    title: "Cara Membuat Kontrak Sederhana",
    date: "18 Sep 2025",
    content:
      "Kontrak usaha sederhana harus mencakup identitas para pihak, objek perjanjian, hak dan kewajiban, serta jangka waktu. Pastikan menggunakan bahasa yang jelas agar tidak menimbulkan multi-tafsir. Jika memungkinkan, mintalah pihak ketiga sebagai saksi.",
  },
  3: {
    title: "Pentingnya Legalitas Usaha",
    date: "15 Sep 2025",
    content:
      "Legalitas usaha sangat penting untuk memberikan kepastian hukum, melindungi hak usaha, dan meningkatkan kredibilitas di mata konsumen maupun investor. Tanpa legalitas, risiko sengketa hukum dan keterbatasan akses pembiayaan akan lebih besar.",
  },
};

export default function ArtikelDetail() {
  const { id } = useParams();
  const article = dummyArticles[id];

  if (!article) {
    return (
      <PageWrapper page="detail">
        <div className="p-4 text-center">
          <p className="text-gray-500">Artikel tidak ditemukan ❌</p>
          <Link
            to="/artikel"
            className="mt-4 inline-block text-red-600 font-medium"
          >
            Kembali ke Artikel
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper page="detail">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">{article.title}</h1>
        <p className="text-sm text-gray-500 mb-4">{article.date}</p>
        <p className="text-gray-700 leading-relaxed">{article.content}</p>

        <Link
          to="/artikel"
          className="mt-6 inline-block text-red-600 font-medium hover:underline"
        >
          ← Kembali ke Artikel
        </Link>
      </div>
    </PageWrapper>
  );
}
