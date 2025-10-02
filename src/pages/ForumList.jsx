import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function ForumList() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data awal + realtime listener
  useEffect(() => {
    fetchThreads();

    // Realtime listener: update setiap ada perubahan di tabel forum_threads
    const channel = supabase
      .channel("forum-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "forum_threads" },
        fetchThreads
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchThreads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("forum_threads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil thread:", error);
    } else {
      setThreads(data || []);
    }
    setLoading(false);
  }

  return (
    <PageWrapper page="forum" title="Forum">
      {loading ? (
        <p className="text-center text-gray-500">Memuat diskusi...</p>
      ) : threads.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada diskusi 😅</p>
      ) : (
        <div className="space-y-4">
          {threads.map((t) => (
            <Link
              key={t.id}
              to={`/forum/${t.id}`}
              className="block p-4 bg-white rounded-2xl shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">{t.title}</h2>
              <p className="text-gray-500 text-sm mt-1">
                Oleh {t.author || "Anonim"} •{" "}
                {new Date(t.created_at).toLocaleDateString("id-ID")}
              </p>
            </Link>
          ))}
        </div>
      )}

      <Link
        to="/forum/new"
        className="mt-6 block bg-red-600 text-white py-2 rounded-xl font-medium text-center hover:bg-red-700 transition"
      >
        + Buat Diskusi
      </Link>
    </PageWrapper>
  );
}
