import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function ForumDetail() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);

  // Ambil data thread dari Supabase
  useEffect(() => {
    fetchThread();
    fetchReplies();

    // Realtime listener untuk balasan
    const channel = supabase
      .channel(`forum-replies-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "forum_replies",
          filter: `thread_id=eq.${id}`,
        },
        fetchReplies
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  async function fetchThread() {
    setLoading(true);
    const { data, error } = await supabase
      .from("forum_threads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Gagal ambil thread:", error);
    } else {
      setThread(data);
    }
    setLoading(false);
  }

  async function fetchReplies() {
    const { data, error } = await supabase
      .from("forum_replies")
      .select("*")
      .eq("thread_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Gagal ambil replies:", error);
    } else {
      setReplies(data || []);
    }
  }

  async function handleReply(e) {
    e.preventDefault();
    if (!replyText.trim()) return;

    const { error } = await supabase.from("forum_replies").insert([
      {
        thread_id: id,
        author: "Anonim", // nanti bisa diganti user login
        content: replyText,
      },
    ]);

    if (error) {
      console.error("Gagal kirim balasan:", error);
      alert("Gagal kirim balasan ❌");
    } else {
      setReplyText("");
    }
  }

  if (loading) {
    return (
      <PageWrapper page="detail">
        <div className="p-4 text-center text-gray-500">Memuat thread...</div>
      </PageWrapper>
    );
  }

  if (!thread) {
    return (
      <PageWrapper page="detail">
        <div className="p-4 text-center">
          <p className="text-gray-500">Thread tidak ditemukan ❌</p>
          <Link
            to="/forum"
            className="mt-4 inline-block text-red-600 font-medium"
          >
            Kembali ke Forum
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper page="detail" title={thread.title}>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">{thread.title}</h1>
        <p className="text-gray-500 text-sm mt-1">
          Oleh {thread.author || "Anonim"}
        </p>
        <p className="text-gray-700 mt-4">{thread.content}</p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Balasan</h3>
        <div className="space-y-3">
          {replies.length > 0 ? (
            replies.map((r) => (
              <div
                key={r.id}
                className="p-3 bg-gray-50 border rounded-xl text-sm"
              >
                <p className="font-medium text-gray-700">{r.author}</p>
                <p className="text-gray-600">{r.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada balasan.</p>
          )}
        </div>

        <form onSubmit={handleReply} className="mt-6 space-y-3">
          <textarea
            className="w-full border rounded-xl px-3 py-2"
            rows={3}
            placeholder="Tulis balasan..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Kirim Balasan
          </button>
        </form>

        <Link
          to="/forum"
          className="mt-6 inline-block text-red-600 font-medium hover:underline"
        >
          ← Kembali ke Forum
        </Link>
      </div>
    </PageWrapper>
  );
}
