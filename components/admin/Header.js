"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";

const pageTitles = {
  "/admin": { title: "Dashboard", crumb: "Dashboard" },
  "/admin/pengguna": { title: "Kelola Pengguna", crumb: "Kelola Pengguna" },
  "/admin/teknisi": { title: "Kelola Teknisi", crumb: "Kelola Teknisi" },
  "/admin/kategori-jasa": { title: "Kelola Kategori Jasa", crumb: "Kelola Kategori Jasa" },
  "/admin/layanan": { title: "Kelola Layanan", crumb: "Kelola Layanan" },
  "/admin/booking": { title: "Kelola Booking", crumb: "Kelola Booking" },
  "/admin/riwayat-booking": { title: "Kelola Riwayat Booking", crumb: "Riwayat Booking" },
  "/admin/profil": { title: "Profil Admin", crumb: "Profil" },
};

export default function Header({ onMenuClick }) {
  const pathname = usePathname();
  const current = pageTitles[pathname] || { title: "Admin", crumb: "Admin" };

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
            <Link href="/admin" className="hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            {pathname !== "/admin" && (
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

      {/* Right: Role Switcher & Admin Avatar */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
          <span className="px-2.5 py-1 bg-white text-blue-600 rounded-md shadow-xs">
            Admin
          </span>
          <Link
            href="/pelanggan"
            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 rounded-md transition-colors"
          >
            Pelanggan
          </Link>
          <Link
            href="/teknisi"
            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 rounded-md transition-colors"
          >
            Teknisi
          </Link>
        </div>

        <Link
          href="/admin/profil"
          className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
            AD
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">
              Admin Utama
            </p>
            <p className="text-[10px] text-slate-500">Super Admin</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
