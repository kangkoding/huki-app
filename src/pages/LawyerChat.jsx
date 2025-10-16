import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { supabase } from "@/services/supabaseClient";
import { Send } from "lucide-react";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function LawyerChat() {
  const { userId } = useParams(); // UID user (client)
  const { user: lawyer } = useFirebaseAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // 🔹 Ambil pesan awal
  useEffect(() => {
    if (!lawyer || !userId) return;
    fetchMessages();
  }, [lawyer, userId]);

  // 🔹 Listener Realtime dua arah
  useEffect(() => {
    if (!lawyer || !userId) return;

    const channel = supabase
      .channel("consultations-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "consultations" },
        (payload) => {
          const msg = payload.new;

          // Hanya pesan yang relevan untuk lawyer ↔ user ini
          if (
            (msg.sender === lawyer.uid && msg.recipient === userId) ||
            (msg.sender === userId && msg.recipient === lawyer.uid)
          ) {
            setMessages((prev) => [...prev, msg]);

            setTimeout(() => {
              chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [lawyer, userId]);

  // 🔹 Fetch semua pesan dari DB
  async function fetchMessages() {
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .or(
        `and(sender.eq.${lawyer.uid},recipient.eq.${userId}),and(sender.eq.${userId},recipient.eq.${lawyer.uid})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("❌ Gagal mengambil pesan:", error);
      return;
    }

    setMessages(data || []);
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  // 🔹 Kirim pesan + tampil langsung
  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      lawyer_id: lawyer.uid,
      sender: lawyer.uid,
      recipient: userId,
      message: input.trim(),
      created_at: new Date(),
    };

    // Optimistic render
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    const { error } = await supabase.from("consultations").insert([newMsg]);
    if (error) console.error("❌ Gagal mengirim pesan:", error);

    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <PageWrapper title="Konsultasi Client">
      <div className="flex flex-col h-screen pb-20">
        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((m, i) => (
            <div
              key={m.id || i}
              className={`max-w-[80%] p-2 rounded-lg text-sm break-words ${
                m.sender === lawyer.uid
                  ? "bg-red-600 text-white ml-auto"
                  : "bg-white text-gray-800"
              }`}
            >
              {m.message}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white flex items-center gap-2 border-t"
        >
          <input
            type="text"
            className="flex-1 border rounded-full px-3 py-2 text-sm"
            placeholder="Tulis pesan ke klien..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
