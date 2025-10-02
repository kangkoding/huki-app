import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { supabase } from "@/services/supabaseClient";
import { Send } from "lucide-react";

export default function LawyerChat() {
  const { userId } = useParams(); // ini sender (uid user)
  const { user: lawyer } = useFirebaseAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lawyer?.uid || !userId) return;

    fetchMessages();

    const channel = supabase
      .channel(`consultations-${lawyer.uid}-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "consultations",
          filter: `lawyer_id=eq.${lawyer.uid}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new : m))
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("💬 LawyerChat realtime status:", status);
      });

    return () => {
      console.log("🧹 Unsubscribing LawyerChat channel...");
      supabase.removeChannel(channel);
    };
  }, [lawyer, userId]);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("lawyer_id", lawyer.uid)
      .eq("sender", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("⚠️ Gagal ambil pesan:", error.message);
      setMessages([]);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      lawyer_id: lawyer.uid,
      sender: "lawyer",
      message: input.trim(),
      recipient: userId,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    const { error } = await supabase.from("consultations").insert([newMsg]);
    if (error) {
      console.error("Gagal kirim pesan:", error.message);
      alert("Gagal mengirim pesan ❌");
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-blue-600 text-white font-semibold">
        Chat dengan {userId}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading ? (
          <p className="text-gray-500 text-sm">Memuat pesan...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Belum ada percakapan...</p>
        ) : (
          messages.map((m, idx) => (
            <div
              key={m.id || idx}
              className={`max-w-[80%] p-2 rounded-lg text-sm ${
                m.sender === "lawyer"
                  ? "bg-blue-600 text-white self-end ml-auto"
                  : "bg-white text-gray-800"
              }`}
            >
              {m.message}
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 bg-white flex items-center gap-2 border-t"
      >
        <input
          type="text"
          className="flex-1 border rounded-full px-3 py-2 text-sm"
          placeholder="Tulis balasan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
