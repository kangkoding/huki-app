import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal memuat artikel:", error);
    } else {
      // Ambil excerpt (ringkasan) dari konten
      const formatted = data.map((a) => ({
        ...a,
        excerpt:
          a.content?.slice(0, 100) + (a.content?.length > 100 ? "..." : ""),
      }));
      setArticles(formatted);
    }
    setLoading(false);
  }

  return (
    <PageWrapper page="artikel" title="Artikel Hukum">
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-2xl shadow animate-pulse space-y-2"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">
          Belum ada artikel yang dipublikasikan 📭
        </p>
      ) : (
        <div className="space-y-4">
          {articles.map((a) => (
            <Link
              key={a.id}
              to={`/artikel/${a.id}`}
              className="block p-4 bg-white rounded-2xl shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">{a.title}</h2>
              <p className="text-sm text-gray-500">
                {new Date(a.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mt-2 line-clamp-2">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
