"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wrench, Shield, Users, Wrench as ToolIcon, ArrowRight } from "lucide-react";

export default function RootGatewayPage() {
  const router = useRouter();

  useEffect(() => {
    // Alihkan default ke /admin sesuai konfigurasi awal proyek
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xs text-center max-w-md w-full space-y-6">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-xs">
          <Wrench className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Booking Teknisi Lokal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mengalihkan ke Dashboard Utama... Pilih portal yang ingin Anda buka:
          </p>
        </div>

        <div className="space-y-2.5 text-xs text-left">
          <Link
            href="/admin"
            className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Panel Administrator</p>
                <p className="text-[11px] text-slate-500">Kelola master data, teknisi, dan booking</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link
            href="/pelanggan"
            className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Portal Pelanggan</p>
                <p className="text-[11px] text-slate-500">Pilih layanan, pesan teknisi, & riwayat</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link
            href="/teknisi"
            className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                <ToolIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Portal Mitra Teknisi</p>
                <p className="text-[11px] text-slate-500">Terima order, booking aktif, & riwayat servis</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>
        </div>

        <p className="text-[11px] text-slate-400">
          &copy; 2025 Booking Teknisi Lokal
        </p>
      </div>
    </div>
  );
}
