"use client";

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

      {/* Right: Role Switcher & Technician Avatar */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
          <Link
            href="/admin"
            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 rounded-md transition-colors"
          >
            Admin
          </Link>
          <Link
            href="/pelanggan"
            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 rounded-md transition-colors"
          >
            Pelanggan
          </Link>
          <span className="px-2.5 py-1 bg-white text-blue-600 rounded-md shadow-xs">
            Teknisi
          </span>
        </div>

        {/* Location Badge (extends Lokasi) */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="font-medium">Klojen, Malang</span>
        </div>

        {/* Technician Profile Pill */}
        <Link
          href="/teknisi/profil"
          className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
            AG
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                Agus Prasetyo
              </p>
              <span className="text-[10px] text-amber-600 font-bold flex items-center">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 mr-0.5" />
                4.9
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Mitra Teknisi</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
