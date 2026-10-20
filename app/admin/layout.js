"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { ToastProvider } from "@/components/admin/ToastContext";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Jika sedang di halaman login admin, lewati pengecekan
    if (pathname === "/admin/login") {
      setIsChecking(false);
      setIsAuthorized(true);
      return;
    }

    try {
      const raw = localStorage.getItem("admin_auth");
      if (!raw) {
        setIsAuthorized(false);
        router.replace("/admin/login");
        return;
      }

      const data = JSON.parse(raw);
      if (!data || data.role !== "admin") {
        setIsAuthorized(false);
        router.replace("/admin/login");
        return;
      }

      setIsAuthorized(true);
    } catch {
      setIsAuthorized(false);
      router.replace("/admin/login");
    } finally {
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Jika halaman login admin, render layar penuh tanpa sidebar dan header admin
  if (pathname === "/admin/login") {
    return <ToastProvider>{children}</ToastProvider>;
  }

  // Tampilkan layar loading proteksi jika belum terotentikasi
  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2.5">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">
            Memverifikasi hak akses Administrator...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}
