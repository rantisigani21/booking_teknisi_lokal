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
  ChevronLeft,
  Navigation,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function TeknisiActiveBookingPage() {
  const [activeBookings, setActiveBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingId, setIsUpdatingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [successToast, setSuccessToast] = useState("");
  const [error, setError] = useState("");
  const [techId, setTechId] = useState(null);

  const fetchActiveBookings = async (currentTechId) => {
    setIsLoading(true);
    setError("");
    try {
      const url = currentTechId
        ? `/api/booking?teknisi_id=${currentTechId}`
        : "/api/booking";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Filter pesanan yang aktif (diterima atau diproses)
        const active = json.data.filter((b) =>
          ["diterima", "diproses"].includes((b.status || "").toLowerCase())
        );
        setActiveBookings(active);
      } else {
        setError("Gagal memuat daftar booking aktif.");
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
      fetchActiveBookings(tId);
    };

    init();
  }, []);

  // Update status kerja / tahap pengerjaan
  const handleUpdateTahap = async (bookingId, nextTahap) => {
    setIsUpdatingId(bookingId);
    const isFinishing = nextTahap === "Selesai";
    const newStatus = isFinishing ? "selesai" : "diproses";

    try {
      const res = await fetch(`/api/booking/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          catatan: isFinishing
            ? "Pengerjaan servis selesai. Perangkat telah diperbaiki dan dites normal."
            : `Teknisi memperbarui tahap pengerjaan: ${nextTahap}`,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (isFinishing) {
          // Hapus dari list aktif karena sudah selesai
          setActiveBookings((prev) => prev.filter((b) => b.id !== bookingId));
          setSuccessToast(`Pesanan #${bookingId} berhasil diselesaikan! Riwayat servis telah diperbarui.`);
        } else {
          setActiveBookings((prev) =>
            prev.map((b) =>
              b.id === bookingId
                ? { ...b, status: newStatus, catatan_terakhir: nextTahap }
                : b
            )
          );
          setSuccessToast(`Tahap kerja pesanan #${bookingId} diperbarui: ${nextTahap}`);
        }

        if (selectedBooking && selectedBooking.id === bookingId) {
          if (isFinishing) setSelectedBooking(null);
          else setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }

        setTimeout(() => setSuccessToast(""), 4000);
      } else {
        alert(json.message || "Gagal memperbarui status.");
      }
    } catch {
      alert("Gagal menghubungi server.");
    } finally {
      setIsUpdatingId(null);
    }
  };

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
              Booking Aktif yang Ditangani
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pesanan servis pelanggan yang telah Anda terima dan sedang dalam proses pengerjaan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchActiveBookings(techId)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Refresh Pesanan Aktif"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold self-start sm:self-auto">
              {activeBookings.length} Pesanan Berjalan
            </span>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* List Kartu Booking Aktif */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
          <span>Memuat data booking aktif...</span>
        </div>
      ) : activeBookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Tidak Ada Booking Aktif</h3>
            <p className="text-xs text-slate-400 mt-1">
              Saat ini tidak ada pesanan yang sedang berjalan. Buka beranda untuk melihat permintaan servis baru.
            </p>
          </div>
          <Link
            href="/teknisi"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Cek Permintaan Masuk</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {activeBookings.map((booking) => {
            const waNumber = (booking.pelanggan_no_hp || "").replace(/\D/g, "").replace(/^0/, "62");
            const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.alamat || "Makassar")}`;

            return (
              <div
                key={booking.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 hover:border-blue-300 transition-colors"
              >
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded text-xs">
                      {booking.kode_booking}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                      {booking.status}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Jadwal: {new Date(booking.tanggal_booking).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })} ({booking.waktu_booking})
                  </span>
                </div>

                {/* Info Layanan & Pelanggan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block">
                        {booking.nama_kategori}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{booking.nama_layanan}</h3>
                    </div>

                    {booking.keluhan && (
                      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
                        <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Catatan Kerusakan Pelanggan:</span>
                        <p className="text-slate-700 italic">&ldquo;{booking.keluhan}&rdquo;</p>
                      </div>
                    )}
                  </div>

                  {/* Info Lokasi & Kontak Pelanggan */}
                  <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-slate-800">{booking.pelanggan_nama}</span>
                      </div>
                      <span className="font-mono text-slate-500 text-[11px]">{booking.pelanggan_no_hp}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{booking.alamat}</span>
                    </div>

                    {/* Tombol Kontak Cepat */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                      {waNumber && (
                        <a
                          href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(booking.pelanggan_nama)},%20saya%20teknisi%20untuk%20servis%20${encodeURIComponent(booking.nama_layanan)}%20(Kode:%20${booking.kode_booking})`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      <a
                        href={gmapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-600" />
                        <span>Buka Rute Maps</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Footer: Tarif & Tombol Update Tahap Kerja */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Biaya Servis</span>
                    <span className="text-base font-extrabold text-blue-600">
                      Rp {Number(booking.total_harga || 0).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      disabled={isUpdatingId === booking.id}
                      onClick={() => handleUpdateTahap(booking.id, "Menuju Lokasi Pelanggan")}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Menuju Lokasi
                    </button>

                    <button
                      type="button"
                      disabled={isUpdatingId === booking.id}
                      onClick={() => handleUpdateTahap(booking.id, "Sedang Dikerjakan")}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Mulai Kerjakan
                    </button>

                    <button
                      type="button"
                      disabled={isUpdatingId === booking.id}
                      onClick={() => handleUpdateTahap(booking.id, "Selesai")}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tandai Selesai</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
