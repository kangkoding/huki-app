import { useEffect, useState } from "react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { supabase } from "@/services/supabaseClient";
import { Link } from "react-router-dom";
import NotificationsBanner from "@/components/NotificationsBanner";

export default function LawyerPanel() {
  const { user } = useFirebaseAuth();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (user) loadClients();
  }, [user]);

  async function loadClients() {
    // Ambil semua konsultasi yang lawyer_id = lawyer.uid
    const { data, error } = await supabase
      .from("consultations")
      .select("sender")
      .eq("lawyer_id", user.uid);

    if (error) {
      console.error("Gagal load consultations:", error);
      return;
    }

    // Ambil semua UID unik yang pernah ngirim pesan ke lawyer
    const uniqueSenders = [...new Set(data.map((m) => m.sender))];

    const result = await Promise.all(
      uniqueSenders.map(async (uid) => {
        // Ambil profil user dari tabel profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("name,email")
          .eq("id", uid)
          .single();

        // Ambil semua rating yang pernah user ini kasih ke lawyer
        const { data: ratingData } = await supabase
          .from("lawyer_reviews")
          .select("rating")
          .eq("lawyer_id", user.uid)
          .eq("user_id", uid);

        const avgRating =
          ratingData?.length > 0
            ? (
                ratingData.reduce((acc, r) => acc + r.rating, 0) /
                ratingData.length
              ).toFixed(1)
            : null;

        return {
          uid,
          name: profile?.name || profile?.email || uid,
          avgRating,
        };
      })
    );

    setClients(result);
  }

  return (
    <div className="p-4 pb-24">
      <NotificationsBanner role="lawyer" />
      <h1 className="text-xl font-bold mb-4">Daftar Konsultasi</h1>

      {clients.length === 0 ? (
        <p className="text-gray-500">Belum ada konsultasi.</p>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => (
            <Link
              key={c.uid}
              to={`/lawyer/chat/${c.uid}`}
              className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-gray-500">
                {c.avgRating ? `⭐ ${c.avgRating}/5` : "Belum ada rating"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
