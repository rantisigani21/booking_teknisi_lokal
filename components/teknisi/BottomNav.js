"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, History, User } from "lucide-react";

export default function TeknisiBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Beranda", href: "/teknisi", icon: LayoutDashboard },
    { label: "Booking Aktif", href: "/teknisi/booking", icon: CalendarCheck },
    { label: "Riwayat", href: "/teknisi/riwayat", icon: History },
    { label: "Profil", href: "/teknisi/profil", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-0.5 ${
                  isActive ? "text-blue-600" : "text-slate-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
