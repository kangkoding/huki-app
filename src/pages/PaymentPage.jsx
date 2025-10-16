import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import PageWrapper from "@/components/layouts/PageWrapper";
import qrisImg from "@/assets/qris-sihuki.jpg";

export default function PaymentPage() {
  const { lawyerId } = useParams();
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const [lawyer, setLawyer] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetchLawyer();
  }, [lawyerId]);

  async function fetchLawyer() {
    const { data, error } = await supabase
      .from("lawyers")
      .select("name, rate_per_session")
      .eq("id", lawyerId)
      .single();

    if (error) console.error(error);
    else setLawyer(data);
  }

  async function handleConfirmPayment() {
    if (!user) {
      alert("Silakan login terlebih dahulu sebelum melanjutkan pembayaran.");
      navigate("/login");
      return;
    }

    const { error } = await supabase.from("payments").insert([
      {
        lawyer_id: lawyerId,
        user_id: user.uid,
        amount: lawyer.rate_per_session,
        status: "pending",
        created_at: new Date(),
      },
    ]);

    if (error) {
      console.error(error);
      alert("Gagal menyimpan pembayaran!");
    } else {
      setConfirmed(true);
      alert("✅ Pembayaran dikirim untuk dikonfirmasi admin!");
      navigate("/riwayat-transaksi"); // opsional redirect
    }
  }

  return (
    <PageWrapper title="Pembayaran Konsultasi">
      <div className="p-4 pb-24 text-center space-y-4">
        <p className="text-gray-600 text-sm">
          Silakan bayar ke QRIS berikut untuk konsultasi dengan{" "}
          <strong>{lawyer?.name}</strong>
        </p>
        <img
          src={qrisImg}
          alt="QRIS Pembayaran"
          className="w-64 mx-auto rounded-lg shadow"
        />
        <p className="font-semibold text-gray-700">
          Nominal: Rp {lawyer?.rate_per_session?.toLocaleString("id-ID")}
        </p>

        {!confirmed ? (
          <button
            onClick={handleConfirmPayment}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
          >
            Saya Sudah Bayar
          </button>
        ) : (
          <p className="text-green-600 font-semibold">
            ✅ Menunggu konfirmasi admin...
          </p>
        )}
      </div>
    </PageWrapper>
  );
}
