import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { Send } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export default function KonsultasiChat() {
  const { id: lawyerId } = useParams();
  const { user } = useFirebaseAuth();

  const lawyerName =
    lawyerId === "lawyer-1"
      ? "Budi Santoso, S.H."
      : lawyerId === "lawyer-2"
      ? "Rina Wijaya, S.H."
      : "Dimas Pratama, S.H.";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!lawyerId || !user?.uid) return;

    fetchMessages();

    const channel = supabase
      .channel(`consultations-${lawyerId}-${user.uid}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "consultations",
          filter: `lawyer_id=eq.${lawyerId}`,
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
        console.log("💬 Konsultasi realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lawyerId, user]);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("lawyer_id", lawyerId)
      .eq("sender", user.uid)
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
    if (!input.trim() || !user?.uid) return;

    const newMsg = {
      lawyer_id: lawyerId,
      sender: user.uid,
      recipient: "lawyer",
      message: input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    const { error } = await supabase.from("consultations").insert([newMsg]);
    if (error) {
      console.error("Gagal kirim pesan:", error);
      alert("Gagal mengirim pesan ❌");
    }
  }

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
    setAutoScroll(isAtBottom);
  };

  return (
    <div className="flex pb-24 flex-col h-screen">
      <div className="p-4 bg-red-600 text-white font-semibold">
        Konsultasi - {lawyerName}
      </div>

      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {loading ? (
          <p className="text-gray-500 text-sm">Memuat pesan...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-400 text-sm italic">
            Belum ada percakapan...
          </p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`max-w-[80%] p-2 rounded-lg text-sm ${
                msg.sender === user.uid
                  ? "bg-red-600 text-white self-end ml-auto"
                  : "bg-white text-gray-800"
              }`}
            >
              {msg.message}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 bg-white flex items-center gap-2 border-t"
      >
        <input
          type="text"
          className="flex-1 border rounded-full px-3 py-2 text-sm"
          placeholder="Tulis pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
