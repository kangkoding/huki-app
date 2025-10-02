import { Link } from "react-router-dom";
import PageWrapper from "@/components/layouts/PageWrapper";

const dummyArticles = [
  {
    id: 1,
    title: "Panduan Hukum Usaha Mikro",
    excerpt: "Ketahui dasar hukum yang wajib dimiliki oleh UMKM di Indonesia.",
    date: "21 Sep 2025",
  },
  {
    id: 2,
    title: "Cara Membuat Kontrak Sederhana",
    excerpt: "Langkah-langkah menyusun kontrak usaha agar tetap sah dan jelas.",
    date: "18 Sep 2025",
  },
  {
    id: 3,
    title: "Pentingnya Legalitas Usaha",
    excerpt: "Kenapa SIUP, NIB, dan izin usaha lainnya harus dimiliki?",
    date: "15 Sep 2025",
  },
];

export default function ArtikelList() {
  return (
    <PageWrapper page="artikel" title="Artikel Hukum">
      <div className="space-y-4">
        {dummyArticles.map((a) => (
          <Link
            key={a.id}
            to={`/artikel/${a.id}`}
            className="block p-4 bg-white rounded-2xl shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">{a.title}</h2>
            <p className="text-sm text-gray-500">{a.date}</p>
            <p className="text-gray-600 mt-2 line-clamp-2">{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
