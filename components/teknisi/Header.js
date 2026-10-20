"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronRight, MapPin, Star } from "lucide-react";

const pageTitles = {
  "/teknisi": { title: "Beranda & Permintaan Baru", crumb: "Permintaan" },
  "/teknisi/booking": { title: "Booking Aktif Lapangan", crumb: "Booking Aktif" },
  "/teknisi/riwayat": { title: "Riwayat Servis & Laporan", crumb: "Riwayat" },
  "/teknisi/profil": { title: "Profil Mitra Teknisi", crumb: "Profil" },
};

export default function TeknisiHeader({ onMenuClick }) {
  const pathname = usePathname();
  const current = pageTitles[pathname] || { title: "Mitra Teknisi", crumb: "Teknisi" };

  const [tech, setTech] = useState({
    nama: "Mitra Teknisi",
    initials: "TK",
    lokasi: "Kota Makassar",
    rating: 4.9,
  });

  useEffect(() => {
    const loadTech = () => {
      try {
        const raw = localStorage.getItem("technician_auth");
        if (raw) {
          const t = JSON.parse(raw);
          const name = t.nama || "Mitra Teknisi";
          const words = name.trim().split(" ").filter(Boolean);
          const initials =
            words.length > 1
              ? (words[0][0] + words[1][0]).toUpperCase()
              : name.slice(0, 2).toUpperCase();

          let loc = "Kota Makassar";
          if (t.alamat || t.lokasi) {
            const fullLoc = t.alamat || t.lokasi;
            const parts = fullLoc.split(",");
            loc = parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim();
          }

          setTech({
            nama: name,
            initials: initials || "TK",
            lokasi: loc,
            rating: t.rating || 4.8,
          });
        }
      } catch {}
    };

    loadTech();
    window.addEventListener("storage", loadTech);
    return () => window.removeEventListener("storage", loadTech);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Breadcrumb + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/teknisi" className="hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            {pathname !== "/teknisi" && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-800 font-medium">{current.crumb}</span>
              </>
            )}
          </div>
          {/* Page Title */}
          <h1 className="text-base font-semibold text-slate-900 leading-tight">
            {current.title}
          </h1>
        </div>
      </div>

      {/* Right: Location & Technician Profile Pill */}
      <div className="flex items-center gap-3">
        {/* Location Badge */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 max-w-[200px]">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="font-medium truncate">{tech.lokasi}</span>
        </div>

        {/* Technician Profile Pill */}
        <Link
          href="/teknisi/profil"
          className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shadow-xs">
            {tech.initials}
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                {tech.nama}
              </p>
              <span className="text-[10px] text-amber-600 font-bold flex items-center shrink-0">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 mr-0.5" />
                {tech.rating}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Mitra Teknisi</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
