import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { auth } from "@/services/firebase";

export default function KonsultasiLawyerProfile() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("lawyers")
        .select("*")
        .eq("id", id)
        .single();
      setLawyer(data || null);
    })();
  }, [id]);

  if (!lawyer) return <div className="p-4">Memuat...</div>;

  const me = auth.currentUser;
  const roomId = `${me?.uid}:${lawyer.uid}`;

  return (
    <div className="p-4 pb-24">
      <div className="flex gap-4">
        <img
          src={lawyer.avatar_url || "https://placehold.co/100"}
          alt={lawyer.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-xl font-bold">{lawyer.name}</h1>
          <p className="text-sm text-gray-500">{lawyer.firm}</p>
          <p className="text-sm mt-2">{lawyer.bio}</p>
          <p className="text-xs text-gray-600 mt-1">
            ⭐ {lawyer.rating || 0} • {lawyer.clients_served || 0} klien •{" "}
            {lawyer.experience_years || 0} thn
          </p>
        </div>
      </div>

      <div className="mt-3 text-sm">
        {(lawyer.specialties || []).map((s) => (
          <span
            key={s}
            className="inline-block mr-1 mb-1 px-2 py-0.5 bg-gray-100 rounded"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          to={`/konsultasi/${lawyer.uid}`}
          className="text-center bg-red-600 text-white py-2 rounded-xl font-medium"
        >
          Chat Sekarang
        </Link>
        <Link
          to={`/konsultasi/call/${encodeURIComponent(roomId)}`}
          className="text-center bg-blue-600 text-white py-2 rounded-xl font-medium"
        >
          Voice/Video Call
        </Link>
      </div>
    </div>
  );
}
