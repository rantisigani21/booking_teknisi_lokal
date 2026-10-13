"use client";

import { useState } from "react";
import Link from "next/link";
import {
  History,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Calendar,
  Clock,
  User,
  Wrench,
  Search,
  X,
  ChevronLeft,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function TeknisiRiwayatPage() {
  const [filterTab, setFilterTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHistory, setSelectedHistory] = useState(null);

  // Riwayat pengerjaan teknisi
  const [historyList, setHistoryList] = useState([
    {
      id: "BK-2025-006",
      pelanggan: "Hendra Gunawan",
      noHp: "0822-4433-2211",
      alamat: "Jl. Ijen No. 88, Klojen, Malang",
      layanan: "Ganti Layar LCD / LED Laptop",
      kategori: "Teknisi Laptop",
      tanggal: "08 Mar 2025",
      jam: "10:00 WIB",
      status: "Selesai",
      biayaTotal: 250000,
      keluhan: "Layar retak di pojok kanan atas setelah terjatuh dari meja.",
      tindakan: "Penggantian panel LED 14 inch Full HD original, tes fungsi layar dan engsel normal.",
      garansiHingga: "08 Apr 2025",
    },
    {
      id: "BK-2025-004",
      pelanggan: "Rizky Pratama",
      noHp: "0878-5544-3322",
      alamat: "Jl. Mawar No. 21, Sukun, Malang",
      layanan: "Instal Ulang OS & Optimalisasi Software PC",
      kategori: "Teknisi Komputer",
      tanggal: "10 Mar 2025",
      jam: "16:30 WIB",
      status: "Selesai",
      biayaTotal: 80000,
      keluhan: "PC sering blue screen dan terinfeksi malware setelah unduh file.",
      tindakan: "Clean install Windows 11, instalasi driver resmi chipset dan GPU, optimasi startup.",
      garansiHingga: "10 Apr 2025",
    },
    {
      id: "BK-2025-002",
      pelanggan: "Bambang Wijaya",
      noHp: "0821-9876-5432",
      alamat: "Jl. Cendrawasih No. 8, Klojen, Malang",
      layanan: "Pembersihan Thermal Paste & Deep Cleaning PC",
      kategori: "Teknisi Komputer",
      tanggal: "02 Mar 2025",
      jam: "14:00 WIB",
      status: "Selesai",
      biayaTotal: 75000,
      keluhan: "Suhu PC mencapai 90 derajat saat rendering video.",
      tindakan: "Pembersihan debu heatsink, aplikasi ulang thermal paste Noctua NT-H1, suhu normal 65C.",
      garansiHingga: "02 Apr 2025",
    },
    {
      id: "BK-2025-005",
      pelanggan: "Anisa Permata",
      noHp: "0813-7788-9900",
      alamat: "Jl. Galunggung No. 12, Blimbing, Malang",
      layanan: "Servis Monitor LED Mati Total",
      kategori: "Teknisi Elektronik",
      tanggal: "09 Mar 2025",
      jam: "13:00 WIB",
      status: "Dibatalkan",
      biayaTotal: 140000,
      keluhan: "Monitor LG 24 inch lampu indikator tidak menyala.",
      tindakan: "Dibatalkan pelanggan karena pelanggan memutuskan membeli unit monitor baru.",
      garansiHingga: "-",
    },
  ]);

  const filteredHistory = historyList.filter((item) => {
    const matchesTab = filterTab === "Semua" || item.status === filterTab;
    const matchesQuery =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.layanan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const totalPendapatan = historyList
    .filter((h) => h.status === "Selesai")
    .reduce((acc, curr) => acc + curr.biayaTotal, 0);

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
                Riwayat Pengerjaan Servis
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Rekap catatan servis yang telah diselesaikan beserta detail tindakan perbaikan.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs self-start sm:self-auto">
              <span className="text-[10px] text-emerald-700 block">Total Pendapatan Servis:</span>
              <strong className="text-sm font-bold text-emerald-800">
                Rp {totalPendapatan.toLocaleString("id-ID")}
              </strong>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex rounded-lg bg-slate-100 p-1">
            {["Semua", "Selesai", "Dibatalkan"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  filterTab === tab
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode / pelanggan / layanan..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600"
            />
          </div>
        </div>

        {/* List Riwayat */}
        <div className="space-y-3.5">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-1.5 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {item.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    • {item.tanggal} ({item.jam})
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {item.layanan}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                  <span>Pelanggan: <strong className="text-slate-700">{item.pelanggan}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {item.alamat}
                  </span>
                </div>
              </div>

              {/* Right: Nominal & Tombol Lihat Detail Riwayat */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block">Biaya Layanan</span>
                  <span className="text-sm font-bold text-slate-900">
                    Rp {item.biayaTotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedHistory(item)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Detail Riwayat</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      {/* MODAL: LIHAT DETAIL RIWAYAT (extends Lihat Detail Riwayat) */}
      {selectedHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in max-h-[90vh] overflow-y-auto text-xs">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Arsip Riwayat Servis
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedHistory.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHistory(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rincian Servis */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status Pekerjaan:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    selectedHistory.status === "Selesai"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {selectedHistory.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Servis:</span>
                <strong className="text-slate-800">{selectedHistory.tanggal} ({selectedHistory.jam})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <strong className="text-slate-800">{selectedHistory.pelanggan} ({selectedHistory.noHp})</strong>
              </div>
              <div className="pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 block mb-0.5">Lokasi:</span>
                <p className="text-slate-800">{selectedHistory.alamat}</p>
              </div>
            </div>

            {/* Keluhan & Tindakan */}
            <div className="space-y-2">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-1">Keluhan Pelanggan:</span>
                <p className="text-slate-700 italic">&ldquo;{selectedHistory.keluhan}&rdquo;</p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-1">Tindakan Perbaikan Teknisi:</span>
                <p className="text-slate-800 font-medium">{selectedHistory.tindakan}</p>
              </div>
            </div>

            {/* Pembayaran & Garansi */}
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Garansi Servis</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Hingga {selectedHistory.garansiHingga}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Total Diterima</span>
                <strong className="text-sm font-bold text-blue-700">
                  Rp {selectedHistory.biayaTotal.toLocaleString("id-ID")}
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedHistory(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
