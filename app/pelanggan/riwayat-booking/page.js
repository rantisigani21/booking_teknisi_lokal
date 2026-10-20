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
  Loader2,
  AlertCircle,
  RefreshCw,
  Ban,
} from "lucide-react";

const STATUS_MAP = {
  menunggu: { label: "Menunggu Konfirmasi", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  diterima: { label: "Diterima", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  diproses: { label: "Diproses", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  selesai: { label: "Selesai", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  dibatalkan: { label: "Dibatalkan", cls: "bg-rose-50 text-rose-700 border-rose-200" },
};

function getStatusInfo(status) {
  const key = (status || "").toLowerCase();
  return STATUS_MAP[key] || { label: status, cls: "bg-slate-100 text-slate-700 border-slate-200" };
}

function formatTanggal(val) {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return val;
  }
}

export default function PelangganRiwayatPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [pelangganId, setPelangganId] = useState(null);

  const fetchBookings = async (pId) => {
    setIsLoading(true);
    setError("");
    try {
      const url = pId
        ? `/api/booking?pelanggan_id=${pId}`
        : "/api/booking";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data || []);
      } else {
        setError("Gagal memuat riwayat booking.");
      }
    } catch {
      setError("Gagal menghubungkan ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      let pId = null;
      try {
        const raw = localStorage.getItem("customer_auth");
        if (raw) {
          const u = JSON.parse(raw);
          if (u.id) {
            pId = u.id;
            setPelangganId(u.id);
          }
        }
      } catch {}

      if (!pId) {
        try {
          const meRes = await fetch("/api/auth/me");
          const meJson = await meRes.json();
          if (meRes.ok && meJson.success && meJson.data?.id) {
            pId = meJson.data.id;
            setPelangganId(pId);
          }
        } catch {}
      }

      fetchBookings(pId);
    };

    initAuth();
  }, []);

  const handleOpenDetail = async (item) => {
    setSelectedBooking(item);
    setIsLoadingDetail(true);
    try {
      const res = await fetch(`/api/booking/${item.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSelectedBooking(json.data);
      }
    } catch (e) {
      console.error("Gagal mengambil detail booking:", e);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/booking/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "dibatalkan",
          catatan: "Dibatalkan oleh pelanggan",
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        fetchBookings(pelangganId);
        setSelectedBooking(null);
      } else {
        alert(json.message || "Gagal membatalkan pesanan.");
      }
    } catch {
      alert("Gagal menghubungkan ke server.");
    } finally {
      setIsCancelling(false);
    }
  };

  const filtered = bookings.filter((item) => {
    const status = (item.status || "").toLowerCase();
    const matchesTab =
      activeTab === "Semua"
        ? true
        : activeTab === "Aktif"
        ? status === "menunggu" || status === "diterima" || status === "diproses"
        : activeTab === "Selesai"
        ? status === "selesai"
        : status === "dibatalkan";

    const q = searchTerm.toLowerCase();
    const matchesQuery =
      (item.kode_booking || "").toLowerCase().includes(q) ||
      (item.nama_layanan || "").toLowerCase().includes(q) ||
      (item.teknisi_nama || "").toLowerCase().includes(q);

    return matchesTab && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Riwayat Booking & Servis</h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau status pengerjaan pesanan aktif dan arsip histori servis teknisi Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchBookings(pelangganId)}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            title="Muat Ulang"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/pelanggan/booking"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Booking Teknisi Baru</span>
          </Link>
        </div>
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
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari kode booking / layanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button
            type="button"
            onClick={() => fetchBookings(pelangganId)}
            className="ml-auto underline cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex gap-2">
                    <div className="h-4 bg-slate-200 rounded w-28" />
                    <div className="h-4 bg-slate-200 rounded w-20" />
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
                <div className="h-8 bg-slate-200 rounded w-24 ml-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Riwayat Booking</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm
              ? "Tidak ditemukan booking yang sesuai pencarian."
              : "Belum ada pesanan dengan filter status ini."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const si = getStatusInfo(item.status);
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
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${si.cls}`}>
                      {si.label}
                    </span>
                    <span className="text-slate-400">
                      • {formatTanggal(item.tanggal_booking)} ({item.waktu_booking || "—"})
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{item.nama_layanan}</h4>

                  <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      Teknisi: <strong className="text-slate-700">{item.teknisi_nama || "Menunggu penugasan"}</strong>
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
                    <span className="text-[10px] text-slate-400 block">Total Biaya</span>
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

      {/* Modal Detail */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Rincian Riwayat
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedBooking.kode_booking}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingDetail && (
              <div className="flex items-center justify-center py-2 text-slate-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Memuat riwayat status terkini...</span>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              {[
                ["Status Pesanan", (() => {
                  const si = getStatusInfo(selectedBooking.status);
                  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${si.cls}`}>{si.label}</span>;
                })()],
                ["Layanan", <strong key="l" className="text-slate-800">{selectedBooking.nama_layanan}</strong>],
                ["Kategori", selectedBooking.nama_kategori || "—"],
                ["Teknisi Ditugaskan", <strong key="t" className="text-slate-800">{selectedBooking.teknisi_nama || "Menunggu penugasan"}</strong>],
                ["No. HP Teknisi", selectedBooking.teknisi_no_hp || "—"],
                ["Waktu Kunjungan", `${formatTanggal(selectedBooking.tanggal_booking)} (${selectedBooking.waktu_booking || "—"})`],
                ["Total Biaya", <strong key="b" className="text-blue-600 text-sm">Rp {Number(selectedBooking.total_harga || 0).toLocaleString("id-ID")}</strong>],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-slate-500">{label}:</span>
                  <span>{val}</span>
                </div>
              ))}

              <div className="pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 block mb-0.5">Alamat Kunjungan:</span>
                <p className="text-slate-800 font-medium">{selectedBooking.alamat}</p>
              </div>
            </div>

            {selectedBooking.keluhan && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-1">Catatan Kerusakan:</span>
                <p className="text-slate-700 italic">&ldquo;{selectedBooking.keluhan}&rdquo;</p>
              </div>
            )}

            {/* Riwayat Status Log */}
            {selectedBooking.riwayat_status && selectedBooking.riwayat_status.length > 0 && (
              <div className="space-y-2 p-3 bg-slate-50/70 border border-slate-200 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Kronologi Status Pengerjaan
                </p>
                <div className="space-y-2">
                  {selectedBooking.riwayat_status.map((r) => (
                    <div key={r.id} className="flex items-start gap-2.5 text-[11px]">
                      <span className="text-slate-400 shrink-0 text-[10px]">
                        {formatTanggal(r.created_at)}
                      </span>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800 uppercase text-[10px] mr-1.5 px-1.5 py-0.5 bg-slate-200 rounded">
                          {r.status}
                        </span>
                        <span className="text-slate-600">{r.catatan || "Pembaruan status"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              {/* WhatsApp Chat button */}
              {selectedBooking.teknisi_no_hp ? (
                <a
                  href={`https://wa.me/${selectedBooking.teknisi_no_hp.replace(/\D/g, "").replace(/^0/, "62")}?text=Halo%20Teknisi,%20saya%20pemesan%20booking%20kode%20${selectedBooking.kode_booking}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat Teknisi</span>
                </a>
              ) : null}

              {/* Batalkan Pesanan jika status masih menunggu */}
              {(selectedBooking.status || "").toLowerCase() === "menunggu" && (
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{isCancelling ? "Membatalkan..." : "Batalkan Booking"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold ml-auto cursor-pointer"
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
