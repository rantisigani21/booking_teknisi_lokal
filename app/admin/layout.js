"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Jika halaman login admin, render layar penuh tanpa sidebar dan header admin
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Fixed on desktop, drawer on mobile) */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-60 min-w-0">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer info */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
          &copy; 2025 Booking Teknisi Lokal — Panel Administrasi Layanan Jasa
        </footer>
      </div>
    </div>
  );
}
