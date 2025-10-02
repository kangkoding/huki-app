import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { Link } from "react-router-dom";

export default function KonsultasiAdvokat() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState({ specialty: "", sort: "popular" });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("lawyers").select("*");
      setList(data || []);
    })();
  }, []);

  const filtered = useMemo(() => {
    let arr = [...list];
    if (q.trim()) {
      const s = q.toLowerCase();
      arr = arr.filter(
        (x) =>
          x.name?.toLowerCase().includes(s) ||
          x.firm?.toLowerCase().includes(s) ||
          (x.specialties || []).join(",").toLowerCase().includes(s)
      );
    }
    if (filter.specialty) {
      arr = arr.filter((x) => (x.specialties || []).includes(filter.specialty));
    }
    if (filter.sort === "popular") arr.sort((a, b) => (b.clients_served||0) - (a.clients_served||0));
    if (filter.sort === "cheap") arr.sort((a, b) => (a.rate_per_session||0) - (b.rate_per_session||0));
    if (filter.sort === "rating") arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return arr;
  }, [list, q, filter]);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-3">Cari Advokat</h1>

      <div className="flex gap-2">
        <input
          placeholder="Cari nama, firma, spesialisasi..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={filter.specialty}
          onChange={(e) => setFilter((f) => ({ ...f, specialty: e.target.value }))}
        >
          <option value="">Semua Bidang</option>
          <option>Bisnis & kontrak</option>
          <option>Perizinan usaha</option>
          <option>Ketenagakerjaan</option>
          <option>Sengketa bisnis / utang-piutang</option>
          <option>Pajak UMKM</option>
        </select>
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={filter.sort}
          onChange={(e) => setFilter((f) => ({ ...f, sort: e.target.value }))}
        >
          <option value="popular">Terpopuler</option>
          <option value="cheap">Termurah</option>
          <option value="rating">Rating Tertinggi</option>
        </select>
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map((l) => (
          <Link
            key={l.id}
            to={`/konsultasi/advokat/${l.id}`}
            className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex gap-3">
              <img
                src={l.avatar_url || "https://via.placeholder.com/80"}
                alt={l.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold">{l.name}</div>
                <div className="text-xs text-gray-500">{l.firm || "-"}</div>
                <div className="text-xs mt-1">
                  {(l.specialties || []).map((s) => (
                    <span key={s} className="inline-block mr-1 px-2 py-0.5 bg-gray-100 rounded">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  ⭐ {l.rating || 0} • {l.clients_served || 0} klien • Rp {l.rate_per_session || 0}/sesi
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
