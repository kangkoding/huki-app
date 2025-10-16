import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { auth } from "@/services/firebase";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function RiwayatTransaksi() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        fetchTransactions(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  async function fetchTransactions(uid) {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        id,
        lawyer_id,
        status,
        created_at,
        lawyers(name, rate_per_session, photo_url)
      `
      )
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal ambil transaksi:", error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  }

  function handleStartChat(lawyerId) {
    navigate(`/konsultasi/${lawyerId}`);
  }

  return (
    <PageWrapper title="Riwayat Transaksi">
      <div className="p-4 pb-24 space-y-3">
        {loading ? (
          <p className="text-gray-500 text-center">Memuat transaksi...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-center">
            Belum ada transaksi pembayaran.
          </p>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-xl shadow flex flex-col gap-3"
            >
              {/* Bagian info lawyer */}
              <div className="flex items-center gap-3">
                <img
                  src={t.lawyers?.photo_url || "https://placehold.co/60"}
                  alt={t.lawyers?.name || "Lawyer"}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 leading-tight">
                    {t.lawyers?.name || "Lawyer"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tarif: Rp{" "}
                    {t.lawyers?.rate_per_session?.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(t.created_at).toLocaleString()}
                  </p>
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      t.status === "confirmed"
                        ? "text-green-600"
                        : t.status === "pending"
                        ? "text-yellow-600"
                        : "text-gray-400"
                    }`}
                  >
                    {t.status === "confirmed"
                      ? "Dikonfirmasi Admin"
                      : t.status === "pending"
                      ? "Menunggu Konfirmasi"
                      : "Status Tidak Dikenal"}
                  </p>
                </div>
              </div>

              {/* Tombol di bawah */}
              {t.status === "confirmed" && (
                <div className="flex justify-end w-full">
                  <button
                    onClick={() => handleStartChat(t.lawyer_id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition"
                  >
                    Mulai Konsultasi
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
}
