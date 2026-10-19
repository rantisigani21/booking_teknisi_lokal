"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronRight, MapPin } from "lucide-react";

const pageTitles = {
  "/pelanggan": { title: "Beranda & Pilih Layanan", crumb: "Layanan" },
  "/pelanggan/booking": { title: "Form Booking Teknisi", crumb: "Booking" },
  "/pelanggan/riwayat-booking": { title: "Riwayat Booking & Servis", crumb: "Riwayat" },
  "/pelanggan/profil": { title: "Profil Pelanggan", crumb: "Profil" },
};

export default function PelangganHeader({ onMenuClick }) {
  const pathname = usePathname();
  const current = pageTitles[pathname] || { title: "Portal Pelanggan", crumb: "Pelanggan" };

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
            <Link href="/pelanggan" className="hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            {pathname !== "/pelanggan" && (
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

      {/* Right: Role Switcher & Customer Avatar */}
      <div className="flex items-center gap-3">

        {/* Location Badge (extends Lokasi) */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="font-medium">Klojen, Malang</span>
        </div>

        {/* Customer Profile Pill */}
        <Link
          href="/pelanggan/profil"
          className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
            SR
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">
              Siti Rahmawati
            </p>
            <p className="text-[10px] text-slate-500">Pelanggan</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
