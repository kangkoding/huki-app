import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import PageWrapper from "@/components/layouts/PageWrapper";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export default function LawyerDetail() {
  const { id } = useParams(); // ID lawyer dari URL
  const navigate = useNavigate();
  const { user } = useFirebaseAuth(); // biar tahu siapa user-nya
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLawyer();
  }, [id]);

  async function fetchLawyer() {
    setLoading(true);
    const { data, error } = await supabase
      .from("lawyers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Gagal ambil data lawyer:", error);
      setLawyer(null);
    } else {
      setLawyer(data);
    }
    setLoading(false);
  }

  // 🧠 Cek apakah user sudah pernah bayar sebelumnya
  async function handleConsultationClick() {
    if (!user) {
      alert("Silakan login terlebih dahulu sebelum konsultasi.");
      navigate("/login");
      return;
    }

    const { data: payment, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user.uid)
      .eq("lawyer_id", id)
      .eq("status", "paid")
      .maybeSingle();

    if (error) {
      console.error("Gagal memeriksa status pembayaran:", error);
      return;
    }

    if (payment) {
      // ✅ Sudah bayar → langsung masuk ke chat
      navigate(`/konsultasi/${lawyer.id}`);
    } else {
      // 💳 Belum bayar → arahkan ke halaman pembayaran
      navigate(`/payment/${lawyer.id}`);
    }
  }

  if (loading) {
    return (
      <PageWrapper page="lawyer-detail">
        <div className="p-4 text-center text-gray-500">
          Memuat data lawyer...
        </div>
      </PageWrapper>
    );
  }

  if (!lawyer) {
    return (
      <PageWrapper page="lawyer-detail">
        <div className="p-4 text-center">
          <p className="text-gray-500">Lawyer tidak ditemukan ❌</p>
          <Link
            to="/lawyers"
            className="mt-4 inline-block text-red-600 font-medium hover:underline"
          >
            Kembali ke Daftar Lawyer
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper page="lawyer-detail" title="Detail Lawyer">
      <div className="p-4">
        {/* Foto & Nama */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src={lawyer.photo_url || "https://placehold.co/100"}
            alt={lawyer.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{lawyer.name}</h1>
            {lawyer.firm && <p className="text-gray-600">{lawyer.firm}</p>}
            <p className="text-sm text-gray-500">
              {lawyer.specialization || "Bidang Hukum"} •{" "}
              {lawyer.experience_years || 0} tahun pengalaman
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500 text-sm">
                ⭐ {lawyer.rating ? Number(lawyer.rating).toFixed(1) : 0}
              </span>
              <span className="text-xs text-gray-500">
                {lawyer.clients_handled || 0} klien
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {lawyer.bio && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Tentang</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {lawyer.bio}
            </p>
          </div>
        )}

        {/* Tarif */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1">Tarif Konsultasi</h2>
          <p className="text-gray-800 font-medium text-xl">
            Rp {lawyer.rate_per_session?.toLocaleString("id-ID")} / sesi
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3">
          <button
            onClick={handleConsultationClick}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700"
          >
            Mulai Konsultasi
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
