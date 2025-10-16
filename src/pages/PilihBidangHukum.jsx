import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layouts/PageWrapper";

const bidangList = [
  { key: "Bisnis & Kontrak", label: "Bisnis & Kontrak", icon: "📑" },
  { key: "Perizinan Usaha", label: "Perizinan Usaha", icon: "🏢" },
  { key: "Ketenagakerjaan", label: "Ketenagakerjaan", icon: "👷" },
  {
    key: "Sengketa Bisnis",
    label: "Sengketa Bisnis / Utang-Piutang",
    icon: "⚖️",
  },
  { key: "Pajak UMKM", label: "Pajak UMKM", icon: "💰" },
  { key: "", label: "Lainnya", icon: "📜" },
];

export default function PilihBidangHukum() {
  const navigate = useNavigate();

  function handleSelect(bidang) {
    // arahkan ke daftar lawyer dengan query string bidang
    navigate(`/lawyers?specialization=${encodeURIComponent(bidang)}`);
  }

  return (
    <PageWrapper page="pilih-bidang" title="Pilih Bidang Hukum">
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Pilih bidang hukum yang sesuai dengan kebutuhan konsultasimu
        </p>

        <div className="grid grid-cols-1 gap-3">
          {bidangList.map((b) => (
            <button
              key={b.key}
              onClick={() => handleSelect(b.key)}
              className="flex items-center gap-3 p-4 bg-white rounded-xl shadow hover:shadow-md transition text-left"
            >
              <span className="text-2xl">{b.icon}</span>
              <span className="font-medium text-gray-800">{b.label}</span>
            </button>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
