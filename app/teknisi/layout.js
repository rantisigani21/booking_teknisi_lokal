"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import TeknisiSidebar from "@/components/teknisi/Sidebar";
import TeknisiHeader from "@/components/teknisi/Header";

export default function TeknisiLayout({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Jika halaman login teknisi, render layar penuh tanpa sidebar dan header
  if (pathname === "/teknisi/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Teknisi */}
      <TeknisiSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-60 min-w-0">
        <TeknisiHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer info */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
          &copy; 2025 Booking Teknisi Lokal — Portal Mitra Lapangan
        </footer>
      </div>
    </div>
  );
}
