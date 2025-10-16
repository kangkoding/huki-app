import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  async function fetchArticle() {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setArticle(data);
    } else {
      console.error("Gagal memuat artikel:", error);
      setArticle(null);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <PageWrapper page="detail">
        <div className="p-4 text-center">
          <p className="text-gray-500 animate-pulse">Memuat artikel...</p>
        </div>
      </PageWrapper>
    );
  }

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
        <p className="text-sm text-gray-500 mb-4">
          {new Date(article.created_at).toLocaleDateString()}
        </p>

        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full rounded-lg mb-4"
          />
        )}

        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </p>

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
