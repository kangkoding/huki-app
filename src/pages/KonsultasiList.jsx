import { Link } from "react-router-dom";
import { User } from "lucide-react";

export default function KonsultasiList() {
  const lawyers = [
    {
      id: "lawyer-1",
      name: "Budi Santoso, S.H.",
      specialization: "Hukum Perdata",
    },
    {
      id: "lawyer-2",
      name: "Rina Wijaya, S.H.",
      specialization: "Hukum Ketenagakerjaan",
    },
    {
      id: "lawyer-3",
      name: "Dimas Pratama, S.H.",
      specialization: "Hukum Bisnis",
    },
  ];

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Konsultasi Hukum</h1>
      <div className="space-y-3">
        {lawyers.map((lawyer) => (
          <Link
            key={lawyer.id}
            to={`/konsultasi/${lawyer.id}`}
            className="flex items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <User className="text-red-600" size={24} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{lawyer.name}</h2>
              <p className="text-xs text-gray-500">{lawyer.specialization}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
