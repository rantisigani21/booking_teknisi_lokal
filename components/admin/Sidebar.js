"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Layers,
  Briefcase,
  CalendarCheck,
  History,
  UserCircle,
  LogOut,
  X,
  ShieldCheck,
  Code2,
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Kelola Pengguna", href: "/admin/pengguna", icon: Users },
  { name: "Kelola Teknisi", href: "/admin/teknisi", icon: Wrench },
  { name: "Kelola Kategori Jasa", href: "/admin/kategori-jasa", icon: Layers },
  { name: "Kelola Layanan", href: "/admin/layanan", icon: Briefcase },
  { name: "Kelola Booking", href: "/admin/booking", icon: CalendarCheck },
  { name: "Kelola Riwayat Booking", href: "/admin/riwayat-booking", icon: History },
  { name: "API & Dokumentasi", href: "/admin/api-docs", icon: Code2 },
  { name: "Profil", href: "/admin/profil", icon: UserCircle },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sistem admin?")) {
      try {
        localStorage.removeItem("admin_auth");
      } catch (e) {
        console.error(e);
      }
      alert("Anda telah berhasil keluar dari sistem.");
      router.push("/admin/login");
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
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Top: Logo & Close Button (Mobile) */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 font-bold text-slate-900 hover:opacity-90 transition-opacity"
              onClick={onClose}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight">
                  Booking Teknisi
                </span>
                <span className="text-[10px] font-medium text-blue-600 tracking-wider uppercase">
                  Lokal Admin
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

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${isActive
                      ? "bg-blue-50 text-blue-600 font-semibold border-l-3 border-blue-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"
                      }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Admin Info & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200/80 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 truncate">
                Admin Utama
              </p>
              <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline shrink-0" />
                Administrator
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
