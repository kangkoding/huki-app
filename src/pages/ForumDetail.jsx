import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { auth } from "@/services/firebase";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function ForumDetail() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetchThread();
    fetchReplies();

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

    return () => supabase.removeChannel(channel);
  }, [id]);

  async function fetchThread() {
    const { data } = await supabase
      .from("forum_threads")
      .select("*")
      .eq("id", id)
      .single();
    setThread(data);
  }

  async function fetchReplies() {
    const { data } = await supabase
      .from("forum_replies")
      .select("*")
      .eq("thread_id", id)
      .order("created_at", { ascending: true });
    setReplies(data || []);
  }

  async function handleReply(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !input.trim()) return;

    await supabase.from("forum_replies").insert([
      {
        thread_id: id,
        user_id: user.uid,
        content: input,
      },
    ]);
    setInput("");
  }

  if (!thread)
    return (
      <PageWrapper page="detail">
        <div className="p-4 text-center text-gray-500">Memuat...</div>
      </PageWrapper>
    );

  return (
    <PageWrapper page="detail" title={thread.title}>
      <div className="p-4 bg-white rounded-xl shadow mb-4">
        <h1 className="text-xl font-bold">{thread.title}</h1>
        <p className="text-gray-700 mt-2">{thread.content}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(thread.created_at).toLocaleString()}
        </p>
      </div>

      <div className="space-y-3">
        {replies.map((r) => (
          <div key={r.id} className="p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-800">{r.content}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(r.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleReply} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Tulis balasan..."
          className="flex-1 border rounded-lg px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Kirim
        </button>
      </form>
    </PageWrapper>
  );
}
