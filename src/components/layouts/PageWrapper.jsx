import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const animations = {
  splash: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  onboarding: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  },
  home: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  },
  artikel: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  detail: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  },
};

export default function PageWrapper({ children, page = "home", title }) {
  const anim = animations[page] || animations.home;
  const navigate = useNavigate();

  return (
    <motion.div
      initial={anim.initial}
      animate={anim.animate}
      exit={anim.exit}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header otomatis */}
      {title && (
        <div className="sticky top-0 bg-[#cc0000] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={22} className="text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
      )}

      {/* Konten halaman */}
      <div className="p-4">{children}</div>
    </motion.div>
  );
}
