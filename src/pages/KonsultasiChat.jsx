import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { auth } from "@/services/firebase";
import { Send } from "lucide-react";
import RatingModal from "@/components/RatingModal";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function KonsultasiChat() {
  const { id: lawyerId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [consultationId, setConsultationId] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  // 🔹 Ambil user dari Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // 🔹 Cek status pembayaran
  useEffect(() => {
    if (user && lawyerId) checkPaymentStatus();
  }, [user, lawyerId]);

  async function checkPaymentStatus() {
    setLoading(true);
    const { data, error } = await supabase
      .from("payments")
      .select("status")
      .eq("user_id", user.uid)
      .eq("lawyer_id", lawyerId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("❌ Gagal cek pembayaran:", error);
      setLoading(false);
      return;
    }

    if (!data) {
      alert("⚠️ Belum melakukan pembayaran konsultasi.");
      navigate(`/payment/${lawyerId}`);
      return;
    }

    if (data.status === "pending") {
      alert("🕓 Pembayaran sedang menunggu konfirmasi admin.");
      navigate(`/payment/${lawyerId}`);
      return;
    }

    if (data.status === "confirmed") setIsConfirmed(true);
    setLoading(false);
  }

  // 🔹 Ambil pesan awal
  async function fetchMessages() {
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .or(
        `and(sender.eq.${user.uid},recipient.eq.${lawyerId}),and(sender.eq.${lawyerId},recipient.eq.${user.uid})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Gagal fetch pesan:", error);
      return;
    }

    setMessages(data || []);
    if (data?.length > 0) setConsultationId(data[0].id);
    scrollToBottom();
  }

  // 🔹 Listener global realtime
  useEffect(() => {
    if (!user || !lawyerId || !isConfirmed) return;
    fetchMessages();

    const channel = supabase
      .channel("consultations-global")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "consultations" },
        (payload) => {
          const msg = payload.new;
          if (
            (msg.sender === user.uid && msg.recipient === lawyerId) ||
            (msg.sender === lawyerId && msg.recipient === user.uid)
          ) {
            setMessages((prev) => [...prev, msg]);
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, lawyerId, isConfirmed]);

  // 🔹 Kirim pesan (tanpa optimistic update biar gak dobel)
  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const { error } = await supabase.from("consultations").insert([
      {
        lawyer_id: lawyerId,
        sender: user.uid,
        recipient: lawyerId,
        message: input.trim(),
        created_at: new Date(),
      },
    ]);

    if (error) console.error("❌ Gagal kirim pesan:", error);
    setInput("");
  }

  function scrollToBottom() {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Memeriksa status pembayaran...
      </div>
    );

  if (!isConfirmed)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-500 space-y-3">
        <p>⚠️ Anda belum bisa memulai konsultasi.</p>
        <button
          onClick={() => navigate(`/payment/${lawyerId}`)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Kembali ke Pembayaran
        </button>
      </div>
    );

  return (
    <PageWrapper title="Konsultasi Chat">
      <div className="flex flex-col h-screen pb-20">
        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((m, i) => (
            <div
              key={m.id || i}
              className={`max-w-[80%] p-2 rounded-lg text-sm break-words ${
                m.sender === user?.uid
                  ? "bg-red-600 text-white ml-auto"
                  : "bg-white text-gray-800"
              }`}
            >
              {m.message}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
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
            <Send size={18} />
          </button>
        </form>

        {/* Tombol Selesai & Rating */}
        {consultationId && (
          <div className="p-3 border-t bg-gray-50 flex justify-end">
            <button
              onClick={() => setShowRating(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 text-sm"
            >
              Selesai & Beri Rating
            </button>
          </div>
        )}

        {/* Modal Rating */}
        <RatingModal
          open={showRating}
          onClose={() => setShowRating(false)}
          lawyerId={lawyerId}
          userId={user?.uid}
          consultationId={consultationId}
        />
      </div>
    </PageWrapper>
  );
}
