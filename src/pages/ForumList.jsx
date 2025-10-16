import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function ForumList() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    fetchThreads();

    const channel = supabase
      .channel("forum-threads-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "forum_threads" },
        fetchThreads
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchThreads() {
    const { data, error } = await supabase
      .from("forum_threads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setThreads(data);
  }

  return (
    <PageWrapper page="forum" title="Forum Diskusi">
      <div className="space-y-4">
        {threads.map((t) => (
          <Link
            key={t.id}
            to={`/forum/${t.id}`}
            className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg">{t.title}</h2>
            <p className="text-sm text-gray-600 line-clamp-2">{t.content}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(t.created_at).toLocaleString()}
            </p>
          </Link>
        ))}
        {threads.length === 0 && (
          <p className="text-gray-500 text-center">Belum ada diskusi.</p>
        )}
      </div>

      <Link
        to="/forum/new"
        className="fixed bottom-20 right-5 bg-red-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-red-700"
      >
        + Buat Diskusi
      </Link>
    </PageWrapper>
  );
}
