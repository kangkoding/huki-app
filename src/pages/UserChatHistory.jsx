import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { auth } from "@/services/firebase";
import { Link } from "react-router-dom";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function UserChatHistory() {
  const [chats, setChats] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    fetchChatHistory();
  }, [user]);

  async function fetchChatHistory() {
    // Ambil semua konsultasi user ini
    const { data: consultations, error } = await supabase
      .from("consultations")
      .select("lawyer_id, created_at")
      .eq("sender", user.uid)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal ambil riwayat chat:", error);
      return;
    }

    // Ambil unique lawyer_id
    const uniqueLawyerIds = [...new Set(consultations.map((c) => c.lawyer_id))];

    // Ambil detail lawyer untuk masing-masing ID
    const lawyerPromises = uniqueLawyerIds.map(async (id) => {
      const { data: lawyer } = await supabase
        .from("lawyers")
        .select("id, name, specialization, photo_url")
        .eq("id", id)
        .single();

      const lastChat = consultations.find(
        (c) => c.lawyer_id === id
      )?.created_at;

      return {
        ...lawyer,
        lastChat,
      };
    });

    const result = await Promise.all(lawyerPromises);
    setChats(result);
  }

  return (
    <PageWrapper page="riwayat-chat" title="Riwayat Konsultasi">
      <div className="p-4 space-y-3">
        {chats.length === 0 ? (
          <p className="text-gray-500 text-center">
            Belum ada riwayat konsultasi.
          </p>
        ) : (
          chats.map((lawyer) => (
            <Link
              key={lawyer.id}
              to={`/konsultasi/${lawyer.id}`}
              className="flex items-center gap-3 p-3 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <img
                src={lawyer.photo_url || "https://placehold.co/50"}
                alt={lawyer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">{lawyer.name}</div>
                <div className="text-xs text-gray-500">
                  {lawyer.specialization || "Bidang hukum"}
                </div>
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(lawyer.lastChat).toLocaleDateString()}
              </div>
            </Link>
          ))
        )}
      </div>
    </PageWrapper>
  );
}
