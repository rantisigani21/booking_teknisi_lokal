"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function TeknisiRiwayatPage() {
  const [filterTab, setFilterTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState("");
  const [techId, setTechId] = useState(null);

  const fetchHistory = async (currentTechId) => {
    setIsLoading(true);
    setError("");
    try {
      const url = currentTechId
        ? `/api/booking?teknisi_id=${currentTechId}`
        : "/api/booking";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Ambil histori yang sudah selesai atau dibatalkan (atau semua)
        setHistoryList(json.data);
      } else {
        setError("Gagal memuat data riwayat servis.");
      }
    } catch {
      setError("Gagal menghubungkan ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let tId = null;
    try {
      const raw = localStorage.getItem("technician_auth");
      if (raw) {
        const t = JSON.parse(raw);
        if (t.teknisi?.id) tId = t.teknisi.id;
        if (t.techId) tId = t.techId;
        setTechId(tId);
      }
    } catch {}

    const init = async () => {
      if (!tId) {
        try {
          const meRes = await fetch("/api/auth/me");
          const meJson = await meRes.json();
          if (meRes.ok && meJson.success && meJson.data?.teknisi?.id) {
            tId = meJson.data.teknisi.id;
            setTechId(tId);
          }
        } catch {}
      }
      fetchHistory(tId);
    };

    init();
  }, []);

  const handleOpenDetail = async (item) => {
    setSelectedHistory(item);
    setIsLoadingDetail(true);
    try {
      const res = await fetch(`/api/booking/${item.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSelectedHistory(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const filteredHistory = historyList.filter((item) => {
    const status = (item.status || "").toLowerCase();
    const matchesTab =
      filterTab === "Semua"
        ? true
        : filterTab === "Selesai"
        ? status === "selesai"
        : status === "dibatalkan";

    const q = searchQuery.toLowerCase();
    const matchesQuery =
      (item.kode_booking || "").toLowerCase().includes(q) ||
      (item.pelanggan_nama || "").toLowerCase().includes(q) ||
      (item.nama_layanan || "").toLowerCase().includes(q);

    return matchesTab && matchesQuery;
  });

  const selesaiList = historyList.filter((i) => (i.status || "").toLowerCase() === "selesai");
  const dibatalkanList = historyList.filter((i) => (i.status || "").toLowerCase() === "dibatalkan");
  const totalPendapatan = selesaiList.reduce((acc, curr) => acc + (Number(curr.total_harga) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <Link
          href="/teknisi"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda Teknisi</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Riwayat Servis & Laporan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Arsip histori pekerjaan servis yang telah Anda selesaikan atau dibatalkan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchHistory(techId)}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors self-start sm:self-auto cursor-pointer"
            title="Refresh Riwayat"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Ringkasan Finansial Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Servis Berhasil</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {isLoading ? "—" : selesaiList.length}
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">Order Selesai</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Pendapatan</p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 truncate">
                {isLoading ? "—" : `Rp ${totalPendapatan.toLocaleString("id-ID")}`}
              </h3>
              <p className="text-xs text-blue-600 font-medium mt-1">Selesai Ditagihkan</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pesanan Dibatalkan</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {isLoading ? "—" : dibatalkanList.length}
              </h3>
              <p className="text-xs text-rose-500 font-medium mt-1">Batal / Ditolak</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
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
            placeholder="Cari kode booking / pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600"
          />
        </div>
      </div>

      {/* List Riwayat */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
          <span>Memuat riwayat servis...</span>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Riwayat</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery ? "Tidak ada pesanan cocok dengan pencarian." : "Belum ada riwayat pesanan."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const isSelesai = (item.status || "").toLowerCase() === "selesai";

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1.5 text-xs flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {item.kode_booking}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isSelesai
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : (item.status || "").toLowerCase() === "dibatalkan"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-slate-400">
                      • {new Date(item.tanggal_booking).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{item.nama_layanan}</h4>

                  <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      Pelanggan: <strong className="text-slate-700">{item.pelanggan_nama}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{item.alamat}</span>
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 block">Biaya Jasa</span>
                    <span className="text-sm font-bold text-blue-600">
                      Rp {Number(item.total_harga || 0).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDetail(item)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail Histori */}
      {selectedHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Rincian Histori Pekerjaan
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedHistory.kode_booking}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHistory(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingDetail && (
              <div className="flex items-center justify-center py-2 text-slate-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Memuat detail status dan catatan...</span>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status Servis:</span>
                <span className="font-bold text-xs uppercase px-2 py-0.5 bg-white border rounded">
                  {selectedHistory.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Layanan:</span>
                <strong className="text-slate-800">{selectedHistory.nama_layanan}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="text-slate-800 font-medium">{selectedHistory.pelanggan_nama} ({selectedHistory.pelanggan_no_hp})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Waktu Kunjungan:</span>
                <span>{new Date(selectedHistory.tanggal_booking).toLocaleDateString("id-ID")} ({selectedHistory.waktu_booking})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Tarif:</span>
                <strong className="text-blue-600 text-sm">Rp {Number(selectedHistory.total_harga || 0).toLocaleString("id-ID")}</strong>
              </div>
              <div className="pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 block mb-0.5">Alamat Servis:</span>
                <p className="text-slate-800 font-medium">{selectedHistory.alamat}</p>
              </div>
            </div>

            {selectedHistory.keluhan && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-1">Keluhan Pelanggan:</span>
                <p className="text-slate-700 italic">&ldquo;{selectedHistory.keluhan}&rdquo;</p>
              </div>
            )}

            {/* Riwayat Status Log */}
            {selectedHistory.riwayat_status && selectedHistory.riwayat_status.length > 0 && (
              <div className="space-y-2 p-3 bg-slate-50/70 border border-slate-200 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Kronologi Pengerjaan
                </p>
                <div className="space-y-2">
                  {selectedHistory.riwayat_status.map((r) => (
                    <div key={r.id} className="flex items-start gap-2.5 text-[11px]">
                      <span className="text-slate-400 shrink-0 text-[10px]">
                        {new Date(r.created_at).toLocaleDateString("id-ID")}
                      </span>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800 uppercase text-[10px] mr-1.5 px-1.5 py-0.5 bg-slate-200 rounded">
                          {r.status}
                        </span>
                        <span className="text-slate-600">{r.catatan || "Pembaruan"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedHistory(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
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
