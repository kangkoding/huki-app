import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
    id, status, amount, created_at,
    user:profiles!payments_user_id_fkey ( id, email, name ),
    lawyer:lawyers!payments_lawyer_id_fkey ( id, name, rate_per_session )
  `
      )
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setTransactions(data);
  }

  async function handleConfirm(id) {
    const { error } = await supabase
      .from("payments")
      .update({ status: "confirmed" })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Gagal mengonfirmasi pembayaran!");
    } else {
      alert("✅ Pembayaran dikonfirmasi!");
      fetchTransactions();
      await supabase.from("notifications").insert([
        {
          user_id: transactions.find((t) => t.id === id).user_id,
          title: "Pembayaran Dikonfirmasi",
          message:
            "Pembayaran konsultasi Anda telah dikonfirmasi admin. Anda bisa mulai konsultasi dengan lawyer.",
          created_at: new Date(),
        },
      ]);
    }
  }

  return (
    <PageWrapper title="Kelola Transaksi">
      <div className="p-4 space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 bg-gray-50 p-6 rounded-lg shadow-sm">
            <p className="text-sm">Belum ada transaksi pembayaran.</p>
          </div>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {t.user?.name || t.user_id} → {t.lawyer?.name || t.lawyer_id}
                </p>
                <p className="text-sm text-gray-600">
                  Rp {t.amount?.toLocaleString("id-ID")} —{" "}
                  <span
                    className={`font-semibold ${
                      t.status === "confirmed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {t.status}
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(t.created_at).toLocaleString()}
                </p>
              </div>
              {t.status === "pending" && (
                <button
                  onClick={() => handleConfirm(t.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                >
                  Confirm
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
}
