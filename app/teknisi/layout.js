"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import TeknisiSidebar from "@/components/teknisi/Sidebar";
import TeknisiHeader from "@/components/teknisi/Header";
import TeknisiBottomNav from "@/components/teknisi/BottomNav";
import { Loader2 } from "lucide-react";

export default function TeknisiLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Jika sedang di halaman login teknisi, lewati pengecekan
    if (pathname === "/teknisi/login") {
      setIsChecking(false);
      setIsAuthorized(true);
      return;
    }

    try {
      const raw = localStorage.getItem("technician_auth");
      if (!raw) {
        setIsAuthorized(false);
        router.replace("/teknisi/login");
        return;
      }

      const data = JSON.parse(raw);
      if (!data || data.role !== "teknisi") {
        setIsAuthorized(false);
        router.replace("/teknisi/login");
        return;
      }

      // Jika akun masih menunggu konfirmasi, tidak boleh masuk
      if (data.status === "menunggu_konfirmasi") {
        localStorage.removeItem("technician_auth");
        setIsAuthorized(false);
        router.replace("/teknisi/login");
        return;
      }

      setIsAuthorized(true);
    } catch {
      setIsAuthorized(false);
      router.replace("/teknisi/login");
    } finally {
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Jika halaman login teknisi, render layar penuh tanpa sidebar dan header
  if (pathname === "/teknisi/login") {
    return <>{children}</>;
  }

  // Tampilkan layar loading proteksi jika belum terotentikasi
  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2.5">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">
            Memverifikasi akses portal mitra teknisi...
          </p>
        </div>
      </div>
    );
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          {children}
        </main>

        {/* Bottom Nav untuk perangkat mobile */}
        <TeknisiBottomNav />

        {/* Footer info */}
        <footer className="hidden md:block border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
          &copy; 2025 Booking Teknisi Lokal — Portal Mitra Lapangan
        </footer>
      </div>
    </div>
  );
}
