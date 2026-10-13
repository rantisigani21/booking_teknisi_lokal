"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  MapPin,
  User,
  Phone,
  Wrench,
  CheckCircle2,
  X,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Navigation,
  FileCheck,
} from "lucide-react";

export default function TeknisiActiveBookingPage() {
  const [activeBookings, setActiveBookings] = useState([
    {
      id: "BK-2025-001",
      pelanggan: "Siti Rahmawati",
      pelangganHp: "0812-3456-7890",
      alamat: "Jl. Melati No. 14, Lowokwaru, Malang",
      layanan: "Servis Motherboard & Ganti Komponen PC",
      kategori: "Teknisi Komputer",
      tanggal: "15 Mar 2025",
      jam: "10:00 WIB",
      status: "Diproses",
      biaya: "Rp 165.000",
      keluhan: "Komputer mati total saat dinyalakan, kipas power supply tidak berputar.",
      tahapStatus: "Menuju Lokasi", // 'Menuju Lokasi' | 'Pengerjaan' | 'Selesai'
    },
  ]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    try {
      const locallyAccepted = JSON.parse(
        localStorage.getItem("technician_active_bookings") || "[]"
      );
      if (locallyAccepted.length > 0) {
        setActiveBookings((prev) => [...locallyAccepted, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update status kerja pengerjaan
  const handleUpdateTahap = (bookingId, nextTahap) => {
    const updated = activeBookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          tahapStatus: nextTahap,
          status: nextTahap === "Selesai" ? "Selesai" : "Diproses",
        };
      }
      return b;
    });

    setActiveBookings(updated);

    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({
        ...selectedBooking,
        tahapStatus: nextTahap,
        status: nextTahap === "Selesai" ? "Selesai" : "Diproses",
      });
    }

    setSuccessToast(`Status pesanan ${bookingId} diperbarui: ${nextTahap}`);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  return (
    <div className="space-y-6">
        {/* Breadcrumb & Header */}
        <div>
          <Link
            href="/teknisi"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda Teknisi</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Booking Aktif yang Ditangani
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pesanan servis yang telah Anda terima dan sedang dalam proses pengerjaan.
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold self-start sm:self-auto">
              {activeBookings.filter((b) => b.tahapStatus !== "Selesai").length} Pesanan Berjalan
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successToast}</span>
          </div>
        )}

        {/* List of Active Bookings */}
        {activeBookings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">
              Tidak Ada Booking Aktif
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Saat ini Anda tidak memiliki jadwal pengerjaan aktif. Periksa permintaan terbaru di halaman beranda.
            </p>
            <Link
              href="/teknisi"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Lihat Permintaan Masuk
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                      {b.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {b.tahapStatus || "Menuju Lokasi"}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    Jadwal: {b.tanggal} ({b.jam})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Info Layanan & Pelanggan */}
                  <div className="md:col-span-8 space-y-2 text-xs">
                    <h3 className="text-sm font-bold text-slate-900">
                      {b.layanan}
                    </h3>
                    <p className="text-slate-600">
                      Pelanggan: <strong className="text-slate-900">{b.pelanggan}</strong> ({b.pelangganHp || b.noHp})
                    </p>
                    <p className="text-slate-600 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{b.alamat}</span>
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100 italic">
                      &ldquo;{b.keluhan}&rdquo;
                    </div>
                  </div>

                  {/* Actions & Biaya */}
                  <div className="md:col-span-4 flex flex-col justify-between pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Biaya Servis</span>
                      <span className="text-base font-bold text-blue-600">
                        {typeof b.biayaTotal === "number"
                          ? `Rp ${b.biayaTotal.toLocaleString("id-ID")}`
                          : b.biaya || "Rp 150.000"}
                      </span>
                    </div>

                    <div className="space-y-2 mt-4">
                      {/* Tombol Lihat Detail Booking */}
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(b)}
                        className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Lihat Detail Booking</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick Whatsapp */}
                      <a
                        href={`https://wa.me/62${(b.pelangganHp || b.noHp || "").replace(/[^0-9]/g, "").slice(1)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp Pelanggan</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Status Stepper Progress Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">Tahap Pengerjaan Teknisi:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateTahap(b.id, "Menuju Lokasi")}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        b.tahapStatus === "Menuju Lokasi"
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      1. Menuju Lokasi
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateTahap(b.id, "Sedang Dikerjakan")}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        b.tahapStatus === "Sedang Dikerjakan"
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      2. Sedang Dikerjakan
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateTahap(b.id, "Selesai")}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        b.tahapStatus === "Selesai"
                          ? "bg-emerald-600 text-white font-bold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      3. Servis Selesai & Lunas
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* MODAL: LIHAT DETAIL BOOKING (extends Lihat Detail Booking) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Detail Booking Lapangan
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedBooking.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rincian Pelanggan & Alamat */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nama Pelanggan:</span>
                <strong className="text-slate-900">{selectedBooking.pelanggan}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nomor WhatsApp:</span>
                <strong className="text-slate-900">{selectedBooking.pelangganHp || selectedBooking.noHp}</strong>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 block mb-0.5">Alamat Kunjungan:</span>
                <p className="text-slate-800 font-medium">{selectedBooking.alamat}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedBooking.alamat
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-semibold mt-1.5"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Buka di Google Maps Navigasi</span>
                </a>
              </div>
            </div>

            {/* Rincian Kerusakan & Biaya */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-slate-500 block">Layanan Diminta:</span>
                <h4 className="font-bold text-slate-900">{selectedBooking.layanan}</h4>
                <p className="text-slate-600 bg-slate-50 p-2 rounded text-[11px] italic">
                  &ldquo;{selectedBooking.keluhan}&rdquo;
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Metode Pembayaran</span>
                  <span className="font-semibold text-slate-800">Bayar di Tempat (Tunai/Transfer)</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Tagihan Total</span>
                  <span className="text-sm font-bold text-blue-600">
                    {typeof selectedBooking.biayaTotal === "number"
                      ? `Rp ${selectedBooking.biayaTotal.toLocaleString("id-ID")}`
                      : selectedBooking.biaya || "Rp 150.000"}
                  </span>
                </div>
              </div>
            </div>

            {/* Aksi Update Status Langsung */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => {
                  handleUpdateTahap(selectedBooking.id, "Selesai");
                  setSelectedBooking(null);
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tandai Servis Telah Selesai & Lunas</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
