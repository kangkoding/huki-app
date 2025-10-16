import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function DaftarLawyer() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const specialization = params.get("specialization");

  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLawyers();
  }, [specialization]);

  async function fetchLawyers() {
    setLoading(true);

    let query = supabase.from("lawyers").select("*");
    if (specialization) {
      query = query.ilike("specialization", `%${specialization}%`);
    }

    const { data, error } = await query.order("rating", { ascending: false });

    if (error) {
      console.error("Gagal ambil daftar lawyer:", error);
      setLawyers([]);
    } else {
      setLawyers(data || []);
    }

    setLoading(false);
  }

  return (
    <PageWrapper page="lawyers" title="Pilih Lawyer">
      <div className="p-4">
        {specialization && (
          <div className="mb-3 text-sm text-gray-600">
            Menampilkan lawyer dengan spesialisasi:{" "}
            <span className="font-medium text-gray-800">{specialization}</span>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-center">Memuat daftar lawyer...</p>
        ) : lawyers.length === 0 ? (
          <p className="text-gray-500 text-center">
            Tidak ada lawyer tersedia.
          </p>
        ) : (
          <div className="space-y-3">
            {lawyers.map((lawyer) => (
              <Link
                key={lawyer.id}
                to={`/lawyers/${lawyer.id}`}
                className="flex items-start gap-3 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <img
                  src={lawyer.photo_url || "https://placehold.co/60"}
                  alt={lawyer.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">{lawyer.name}</h2>
                  <p className="text-sm text-gray-500">
                    {lawyer.specialization}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>
                      ⭐{" "}
                      {lawyer.rating ? Number(lawyer.rating).toFixed(1) : "0"}
                    </span>
                    <span>{lawyer.clients_handled || 0} klien</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
