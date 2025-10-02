import { useEffect, useState } from "react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { supabase } from "@/services/supabaseClient";
import { Link } from "react-router-dom";

export default function LawyerPanel() {
  const { user } = useFirebaseAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user?.uid) {
      fetchRooms();
    }
  }, [user]);

  async function fetchRooms() {
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase
      .from("consultations")
      .select("sender, lawyer_id, created_at")
      .eq("lawyer_id", user.uid)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("⚠️ Gagal ambil consultations:", error.message);
      setErrorMsg("Gagal memuat data konsultasi.");
      setRooms([]);
    } else if (data && data.length > 0) {
      const grouped = Object.values(
        data.reduce((acc, msg) => {
          if (!acc[msg.sender]) {
            acc[msg.sender] = msg;
          }
          return acc;
        }, {})
      );
      setRooms(grouped);
    } else {
      setRooms([]);
    }

    setLoading(false);
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📬 Panel Lawyer</h1>
      {loading ? (
        <p className="text-gray-500">Memuat data konsultasi...</p>
      ) : errorMsg ? (
        <p className="text-red-500">{errorMsg}</p>
      ) : rooms.length === 0 ? (
        <p className="text-gray-500">Belum ada konsultasi masuk.</p>
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => (
            <Link
              key={room.sender}
              to={`/lawyer/chat/${room.sender}`}
              className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <p className="font-semibold">{room.sender}</p>
              <p className="text-xs text-gray-500">Klik untuk balas</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
