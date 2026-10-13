"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  User,
  Phone,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  MessageCircle,
  Bell,
  Star,
} from "lucide-react";

export default function TeknisiHomePage() {
  const router = useRouter();

  // Teknisi profile state
  const [techInfo, setTechInfo] = useState({
    nama: "Agus Prasetyo",
    keahlian: "Teknisi Laptop & Komputer",
    lokasi: "Kec. Klojen, Malang",
    rating: 4.9,
    isOnline: true,
  });

  // State Permintaan Booking Terbaru (extends Permintaan Booking Terbaru)
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: "REQ-2025-011",
      pelanggan: "Dewi Lestari",
      noHp: "0856-1122-3344",
      alamat: "Jl. Veteran No. 45, Kec. Klojen, Malang",
      layanan: "Ganti Layar LCD / LED Laptop",
      kategori: "Teknisi Laptop",
      tanggal: "Hari ini, 15 Mar 2025",
      jam: "13:30 WIB",
      biayaTotal: 265000,
      keluhan: "Layar laptop ASUS 14 inch bergaris ungu vertikal dan berkedip saat digerakkan.",
      jarakKm: "1.2 km dari lokasi Anda",
    },
    {
      id: "REQ-2025-012",
      pelanggan: "Bambang Wijaya",
      noHp: "0821-9876-5432",
      alamat: "Jl. Cendrawasih No. 8, Kec. Klojen, Malang",
      layanan: "Pembersihan Thermal Paste & Deep Cleaning PC",
      kategori: "Teknisi Komputer",
      tanggal: "Hari ini, 15 Mar 2025",
      jam: "16:00 WIB",
      biayaTotal: 90000,
      keluhan: "PC panas sekali dan kipas berbunyi kasar saat menjalankan aplikasi.",
      jarakKm: "2.5 km dari lokasi Anda",
    },
  ]);

  const [notification, setNotification] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("technician_auth");
      if (saved) {
        setTechInfo(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Handler Terima Pesanan
  const handleAcceptRequest = (request) => {
    // Pindahkan ke booking aktif
    const acceptedBooking = {
      ...request,
      status: "Diproses",
      teknisi: techInfo.nama,
      acceptedAt: "Baru saja",
    };

    try {
      const existing = JSON.parse(localStorage.getItem("technician_active_bookings") || "[]");
      existing.unshift(acceptedBooking);
      localStorage.setItem("technician_active_bookings", JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }

    setPendingRequests(pendingRequests.filter((r) => r.id !== request.id));
    setNotification(`Pesanan ${request.id} berhasil diterima! Segera hubungi pelanggan.`);
    setTimeout(() => setNotification(""), 4000);
  };

  // Handler Tolak Pesanan
  const handleRejectRequest = (requestId) => {
    if (confirm("Apakah Anda yakin ingin menolak permintaan pesanan ini?")) {
      setPendingRequests(pendingRequests.filter((r) => r.id !== requestId));
      setNotification(`Pesanan ${requestId} telah ditolak dan akan dialihkan.`);
      setTimeout(() => setNotification(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
        
        {/* Banner Notifikasi Aksi */}
        {notification && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
        )}

        {/* Top Card: Status Teknisi & Lokasi (extends Lokasi) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0">
              {techInfo.nama?.slice(0, 2).toUpperCase() || "AG"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">
                  Selamat Bekerja, {techInfo.nama}
                </h1>
                <span className="inline-flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                  {techInfo.rating || 4.9}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="text-blue-600 font-medium">{techInfo.keahlian}</span>
                <span>•</span>
                {/* Extends Lokasi */}
                <span className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Standby di: <strong>{techInfo.lokasi}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-center">
            <Link
              href="/teknisi/booking"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Buka Booking Aktif</span>
            </Link>
          </div>
        </div>

        {/* 4 Kartu Statistik Performa Kerja */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] text-slate-400 block">Permintaan Baru</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block">
              {pendingRequests.length}
            </span>
            <span className="text-[10px] text-amber-600 font-medium">Perlu konfirmasi</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] text-slate-400 block">Booking Dikerjakan</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-600 mt-1 block">
              1
            </span>
            <span className="text-[10px] text-slate-500">Kunjungan lapangan</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] text-slate-400 block">Servis Selesai</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block">
              38
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Rating rata-rata 4.9</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] text-slate-400 block">Estimasi Penghasilan</span>
            <span className="text-base sm:text-lg font-bold text-emerald-600 mt-1 block truncate">
              Rp 2.450.000
            </span>
            <span className="text-[10px] text-slate-500">Bulan ini</span>
          </div>
        </div>

        {/* SECTION: PERMINTAAN BOOKING TERBARU (extends Permintaan Booking Terbaru) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Permintaan Booking Terbaru Masuk</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {pendingRequests.length} Baru
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pelanggan di area Anda membutuhkan teknisi. Terima atau tolak pesanan sesuai ketersediaan Anda.
              </p>
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">
                Tidak Ada Permintaan Menunggu
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Semua pesanan telah Anda tindak lanjuti. Tetap aktifkan status Online agar pelanggan baru dapat memesan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {req.id}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {req.jarakKm}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {req.layanan}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kategori: <strong className="text-slate-700">{req.kategori}</strong>
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Pelanggan: <strong>{req.pelanggan}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{req.alamat}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Waktu Kunjungan: <strong>{req.tanggal} ({req.jam})</strong></span>
                      </div>
                      <div className="pt-1 border-t border-slate-200/60 text-slate-600 italic text-[11px]">
                        &ldquo;{req.keluhan}&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Biaya & Tombol Aksi Terima/Tolak */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Tarif</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        Rp {req.biayaTotal.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Tolak
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAcceptRequest(req)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Terima Pesanan</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

    </div>
  );
}
