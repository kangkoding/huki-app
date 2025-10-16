import { useState } from "react";
import { supabase } from "@/services/supabaseClient";

export default function RatingModal({
  open,
  onClose,
  lawyerId,
  userId,
  consultationId,
}) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return alert("Berikan rating terlebih dahulu");

    setSubmitting(true);

    // ✅ Cek apakah user sudah kasih rating untuk konsultasi ini
    const { data: existing } = await supabase
      .from("lawyer_reviews")
      .select("id")
      .eq("consultation_id", consultationId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      alert("Anda sudah memberi rating untuk konsultasi ini ✅");
      setSubmitting(false);
      onClose();
      return;
    }

    const { error } = await supabase.from("lawyer_reviews").insert([
      {
        consultation_id: consultationId,
        lawyer_id: lawyerId,
        user_id: userId,
        rating,
        review,
      },
    ]);

    setSubmitting(false);

    if (error) {
      console.error(error);
      alert("Gagal menyimpan rating ❌");
    } else {
      alert("Terima kasih atas rating Anda 🙏");
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
        <h2 className="text-lg font-semibold mb-3 text-center">
          Beri Rating Lawyer
        </h2>

        <div className="flex justify-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className={`text-2xl ${
                num <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          placeholder="Tambahkan review (opsional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full border rounded p-2 text-sm mb-3"
          rows={3}
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:underline text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            {submitting ? "Menyimpan..." : "Kirim"}
          </button>
        </div>
      </div>
    </div>
  );
}
