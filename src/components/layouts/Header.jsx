import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Header({ title, showBack = false }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#cc0000] text-white shadow-md">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/20 transition"
        >
          <ArrowLeft size={22} />
        </button>
      )}
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
}
