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
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function TeknisiHomePage() {
  const router = useRouter();

  // Teknisi profile state
  const [techInfo, setTechInfo] = useState({
    userId: null,
    techId: null,
    nama: "Mitra Teknisi",
    keahlian: "Teknisi Komputer & Laptop",
    lokasi: "Kota Makassar",
    rating: 4.8,
    isOnline: true,
  });

  const [pendingRequests, setPendingRequests] = useState([]);
  const [stats, setStats] = useState({
    baru: 0,
    aktif: 0,
    selesai: 0,
    pendapatan: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingId, setIsProcessingId] = useState(null);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    setError("");

    let currentTechId = null;

    // 1. Ambil info teknisi dari localStorage
    try {
      const raw = localStorage.getItem("technician_auth");
      if (raw) {
        const t = JSON.parse(raw);
        if (t.teknisi?.id) currentTechId = t.teknisi.id;
        if (t.techId) currentTechId = t.techId;
        setTechInfo({
          userId: t.id || null,
          techId: currentTechId,
          nama: t.nama || "Mitra Teknisi",
          keahlian: t.deskripsi || t.keahlian || "Teknisi Komputer & Laptop",
          lokasi: t.alamat || t.lokasi || "Kota Makassar",
          rating: t.rating || 4.8,
          isOnline: t.status_ketersediaan === "tersedia",
        });
      }
    } catch {}

    // 2. Sinkronkan dengan /api/auth/me jika belum dapat techId
    if (!currentTechId) {
      try {
        const meRes = await fetch("/api/auth/me");
        const meJson = await meRes.json();
        if (meRes.ok && meJson.success && meJson.data) {
          const u = meJson.data;
          currentTechId = u.teknisi?.id || null;
          setTechInfo({
            userId: u.id,
            techId: currentTechId,
            nama: u.nama,
            keahlian: u.teknisi?.deskripsi || "Teknisi Komputer & Laptop",
            lokasi: u.teknisi?.alamat || "Kota Makassar",
            rating: 4.8,
            isOnline: u.teknisi?.status_ketersediaan === "tersedia",
          });
        }
      } catch {}
    }

    // 3. Ambil booking yang menunggu konfirmasi (Permintaan Masuk)
    try {
      const [pendingRes, myBookingsRes] = await Promise.all([
        fetch("/api/booking?status=menunggu"),
        currentTechId ? fetch(`/api/booking?teknisi_id=${currentTechId}`) : Promise.resolve(null),
      ]);

      const pendingJson = await pendingRes.json();
      if (pendingJson.success && Array.isArray(pendingJson.data)) {
        // Tampilkan pesanan yang ditugaskan ke teknisi ini atau belum ditugaskan (auto)
        const relevantPending = pendingJson.data.filter(
          (b) => !b.teknisi_id || String(b.teknisi_id) === String(currentTechId)
        );
        setPendingRequests(relevantPending);
      }

      // 4. Hitung metrik statistik teknisi
      if (myBookingsRes) {
        const myJson = await myBookingsRes.json();
        if (myJson.success && Array.isArray(myJson.data)) {
          const list = myJson.data;
          const aktifCount = list.filter((b) =>
            ["diterima", "diproses"].includes((b.status || "").toLowerCase())
          ).length;
          const selesaiList = list.filter(
            (b) => (b.status || "").toLowerCase() === "selesai"
          );
          const totalEarned = selesaiList.reduce(
            (acc, curr) => acc + (Number(curr.total_harga) || 0),
            0
          );

          setStats({
            baru: pendingRequests.length,
            aktif: aktifCount,
            selesai: selesaiList.length,
            pendapatan: totalEarned,
          });
        }
      }
    } catch {
      setError("Gagal memuat data permintaan booking.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler Terima Pesanan
  const handleAcceptRequest = async (request) => {
    setIsProcessingId(request.id);
    try {
      const res = await fetch(`/api/booking/${request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "diproses",
          teknisi_id: techInfo.techId || undefined,
          catatan: `Pesanan diterima oleh teknisi ${techInfo.nama}. Sedang menuju pengerjaan.`,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
        setStats((prev) => ({ ...prev, aktif: prev.aktif + 1 }));
        setNotification(`Pesanan ${request.kode_booking} berhasil diterima! Mengarahkan ke Booking Aktif...`);
        setTimeout(() => {
          setNotification("");
          router.push("/teknisi/booking");
        }, 1500);
      } else {
        alert(json.message || "Gagal menerima pesanan.");
      }
    } catch {
      alert("Gagal menghubungkan ke server.");
    } finally {
      setIsProcessingId(null);
    }
  };

  // Handler Tolak Pesanan
  const handleRejectRequest = async (request) => {
    if (!confirm(`Apakah Anda yakin ingin menolak pesanan ${request.kode_booking}?`)) return;

    setIsProcessingId(request.id);
    try {
      const res = await fetch(`/api/booking/${request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "dibatalkan",
          catatan: `Ditolak oleh teknisi ${techInfo.nama}`,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
        setNotification(`Pesanan ${request.kode_booking} telah ditolak.`);
        setTimeout(() => setNotification(""), 3500);
      } else {
        alert(json.message || "Gagal menolak pesanan.");
      }
    } catch {
      alert("Gagal menghubungkan ke server.");
    } finally {
      setIsProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-slate-900">
              Selamat Datang, {techInfo.nama}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <span className={`w-1.5 h-1.5 rounded-full ${techInfo.isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
              {techInfo.isOnline ? "Siap Melayani" : "Istirahat"}
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            {techInfo.keahlian} • Area Operasional: <strong className="text-slate-700">{techInfo.lokasi}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={fetchData}
            disabled={isLoading}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer shadow-xs"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/teknisi/booking"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors shrink-0"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Booking Aktif</span>
          </Link>
        </div>
      </div>

      {/* Notifikasi Toast Banner */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Kartu Metrik Kerja */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Permintaan Baru
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {isLoading ? "—" : pendingRequests.length}
              </h3>
              <p className="text-xs text-amber-600 font-medium mt-1">Perlu Dikonfirmasi</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Booking Aktif
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {isLoading ? "—" : stats.aktif}
              </h3>
              <p className="text-xs text-blue-600 font-medium mt-1">Tahap Pengerjaan</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Servis Selesai
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {isLoading ? "—" : stats.selesai}
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">Total Berhasil</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Estimasi Pendapatan
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 truncate">
                {isLoading ? "—" : `Rp ${stats.pendapatan.toLocaleString("id-ID")}`}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Servis Selesai</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Permintaan Booking Masuk (Pending Requests) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Permintaan Servis Masuk</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                {pendingRequests.length} Menunggu
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pesanan pelanggan di sekitar Anda yang siap diambil dan dikerjakan.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
            <span>Memuat data permintaan booking...</span>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-800">Semua Permintaan Telah Ditangani!</p>
            <p className="text-slate-400 mt-1">
              Saat ini tidak ada pesanan baru yang menunggu konfirmasi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                      {req.kode_booking}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Menunggu Konfirmasi
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block">
                      {req.nama_kategori || "Layanan Jasa"}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{req.nama_layanan}</h4>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">{req.pelanggan_nama}</span>
                      <span className="text-slate-400 font-mono text-[11px]">({req.pelanggan_no_hp})</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{req.alamat}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>
                        Jadwal: <strong>{new Date(req.tanggal_booking).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</strong> • Jam: <strong>{req.waktu_booking}</strong>
                      </span>
                    </div>
                  </div>

                  {req.keluhan && (
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs">
                      <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Keluhan Kerusakan:</span>
                      <p className="text-slate-700 italic">&ldquo;{req.keluhan}&rdquo;</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Biaya Jasa</span>
                    <span className="text-base font-extrabold text-blue-600">
                      Rp {Number(req.total_harga || 0).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isProcessingId === req.id}
                      onClick={() => handleRejectRequest(req)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Tolak
                    </button>

                    <button
                      type="button"
                      disabled={isProcessingId === req.id}
                      onClick={() => handleAcceptRequest(req)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isProcessingId === req.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Menerima...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terima Pesanan</span>
                        </>
                      )}
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
