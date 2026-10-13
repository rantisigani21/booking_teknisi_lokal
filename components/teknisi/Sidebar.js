"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  History,
  UserCircle,
  LogOut,
  X,
  Wrench,
  ShieldCheck,
  Star,
  Power,
} from "lucide-react";

const navigationItems = [
  { name: "Beranda & Permintaan", href: "/teknisi", icon: LayoutDashboard },
  { name: "Booking Aktif", href: "/teknisi/booking", icon: CalendarCheck },
  { name: "Riwayat Servis", href: "/teknisi/riwayat", icon: History },
  { name: "Profil Teknisi", href: "/teknisi/profil", icon: UserCircle },
];

export default function TeknisiSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("technician_auth");
      if (saved) {
        const t = JSON.parse(saved);
        if (t.isOnline !== undefined) setIsOnline(t.isOnline);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleOnline = () => {
    const nextVal = !isOnline;
    setIsOnline(nextVal);
    try {
      const saved = JSON.parse(localStorage.getItem("technician_auth") || "{}");
      localStorage.setItem("technician_auth", JSON.stringify({ ...saved, isOnline: nextVal }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun mitra teknisi?")) {
      try {
        localStorage.removeItem("technician_auth");
      } catch (e) {
        console.error(e);
      }
      alert("Anda telah berhasil keluar.");
      router.push("/teknisi/login");
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden backdrop-blur-[2px] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top: Logo & Close Button (Mobile) */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
            <Link
              href="/teknisi"
              className="flex items-center gap-2.5 font-bold text-slate-900 hover:opacity-90 transition-opacity"
              onClick={onClose}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight">
                  Booking Teknisi
                </span>
                <span className="text-[10px] font-medium text-blue-600 tracking-wider uppercase">
                  Mitra Teknisi
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Kerja Switcher */}
          <div className="p-3 pb-1">
            <button
              type="button"
              onClick={toggleOnline}
              className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                isOnline
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                  }`}
                />
                <span>{isOnline ? "Status: Online Siaga" : "Status: Offline"}</span>
              </div>
              <Power className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/teknisi"
                  ? pathname === "/teknisi"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold border-l-3 border-blue-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-blue-600" : "text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Technician Info & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200/80 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              AG
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  Agus Prasetyo
                </p>
                <span className="text-[10px] font-bold text-amber-600 flex items-center shrink-0">
                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 mr-0.5" />
                  4.9
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline shrink-0" />
                Mitra Terverifikasi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}
