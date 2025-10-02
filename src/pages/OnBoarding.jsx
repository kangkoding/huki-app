import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  const slides = [
    {
      title: "Konsultasi dengan Advokat",
      desc: "Dapatkan bantuan hukum cepat & terpercaya.",
    },
    {
      title: "Pembuatan Dokumen",
      desc: "Mudah bikin kontrak, perjanjian, dan surat hukum.",
    },
    {
      title: "Edukasi Hukum Praktis",
      desc: "Belajar hukum sederhana untuk UMKM.",
    },
    {
      title: "Forum Diskusi UMKM",
      desc: "Berbagi pengalaman dan solusi bersama.",
    },
  ];

  return (
    <div className="flex flex-col justify-between h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {slides.map((s, i) => (
          <div key={i} className="text-center mb-6">
            <h2 className="text-xl font-bold text-red-700">{s.title}</h2>
            <p className="text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/home")}
        className="bg-[#cc0000] text-white py-3 mx-6 mb-8 rounded-2xl shadow-lg"
      >
        Mulai Sekarang
      </button>
    </div>
  );
}
