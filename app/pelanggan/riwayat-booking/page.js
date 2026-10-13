"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Eye,
  MapPin,
  Wrench,
  Search,
  X,
  MessageCircle,
  Clock,
} from "lucide-react";

import { initialBookings } from "@/lib/dummyData";

export default function PelangganRiwayatPage() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    let localBookings = [];
    try {
      localBookings = JSON.parse(localStorage.getItem("customer_bookings") || "[]");
    } catch (e) {
      console.error(e);
    }

    const customerInitial = initialBookings.filter(
      (b) => b.pelanggan.toLowerCase().includes("siti") || b.pelanggan.toLowerCase().includes("rahma")
    );

    const displayInitials =
      customerInitial.length > 0 ? customerInitial : initialBookings.slice(0, 5);

    setBookings([...localBookings, ...displayInitials]);
  }, []);

  const filtered = bookings.filter((item) => {
    const matchesTab =
      activeTab === "Semua"
        ? true
        : activeTab === "Aktif"
        ? item.status === "Menunggu Konfirmasi" || item.status === "Diproses"
        : item.status === activeTab;

    const q = searchTerm.toLowerCase();
    const matchesQuery =
      item.id.toLowerCase().includes(q) ||
      item.layanan.toLowerCase().includes(q) ||
      item.teknisi.toLowerCase().includes(q);

    return matchesTab && matchesQuery;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Menunggu Konfirmasi":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Diproses":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Selesai":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Dibatalkan":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Senada dengan Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Riwayat Booking & Servis</h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau status pengerjaan pesanan aktif dan arsip histori servis teknisi Anda.
          </p>
        </div>

        <Link
          href="/pelanggan/booking"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Booking Teknisi Baru</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex rounded-lg bg-slate-100 p-1">
          {["Semua", "Aktif", "Selesai", "Dibatalkan"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode booking / layanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600"
          />
        </div>
      </div>

      {/* List Kartu Riwayat */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Riwayat Booking</h3>
          <p className="text-xs text-slate-500 mt-1">
            Belum ada pesanan dengan filter status ini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-1.5 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {item.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                  <span className="text-slate-400">
                    • {item.tanggal} ({item.jam})
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{item.layanan}</h4>

                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-blue-600" />
                    Teknisi: <strong className="text-slate-700">{item.teknisi}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {item.alamat}
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block">Total Biaya</span>
                  <span className="text-sm font-bold text-blue-600">
                    {typeof item.totalBiaya === "number"
                      ? `Rp ${item.totalBiaya.toLocaleString("id-ID")}`
                      : item.biaya || "Rp 95.000"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(item)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Detail</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Riwayat (extends Lihat Detail Riwayat) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Rincian Riwayat
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

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status Pesanan:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Layanan:</span>
                <strong className="text-slate-800">{selectedBooking.layanan}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Teknisi Ditugaskan:</span>
                <strong className="text-slate-800">{selectedBooking.teknisi}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Kunjungan:</span>
                <span className="text-slate-800 font-medium">
                  {selectedBooking.tanggal} ({selectedBooking.jam})
                </span>
              </div>
              <div className="pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 block mb-0.5">Alamat Kunjungan:</span>
                <p className="text-slate-800 font-medium">{selectedBooking.alamat}</p>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-400 block mb-1">Catatan Kerusakan:</span>
              <p className="text-slate-700 italic">
                &ldquo;{selectedBooking.keluhan || "Pemeriksaan dan perbaikan langsung di lokasi."}&rdquo;
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Teknisi,%20saya%20ingin%20tanya%20booking%20kode%20${selectedBooking.id}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
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
