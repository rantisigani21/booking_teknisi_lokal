"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Loader2,
  X,
} from "lucide-react";

function CustomerBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const preServiceId = searchParams.get("serviceId") || "";
  const preTechId = searchParams.get("techId") || "";

  // Data dari API
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Form states
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedServiceId, setSelectedServiceId] = useState(preServiceId);
  const [selectedTechId, setSelectedTechId] = useState(preTechId || "auto");
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [visitTime, setVisitTime] = useState("10:00 WIB");

  // Customer info dari session
  const [pelangganId, setPelangganId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [complaint, setComplaint] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Load data dari API dan session
  useEffect(() => {
    // Ambil info user dari localStorage
    try {
      const raw = localStorage.getItem("customer_auth");
      if (raw) {
        const u = JSON.parse(raw);
        if (u.id) setPelangganId(u.id);
        if (u.nama) setCustomerName(u.nama);
        if (u.no_hp) setCustomerPhone(u.no_hp);
      }
    } catch {}

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [catRes, svcRes, techRes] = await Promise.all([
          fetch("/api/kategori-jasa?status=aktif"),
          fetch("/api/layanan?status=aktif"),
          fetch("/api/teknisi?status_ketersediaan=tersedia"),
        ]);
        const [catJson, svcJson, techJson] = await Promise.all([
          catRes.json(),
          svcRes.json(),
          techRes.json(),
        ]);

        const cats = catJson.data || [];
        const svcs = svcJson.data || [];
        const techs = techJson.data || [];

        setCategories(cats);
        setServices(svcs);
        setTechnicians(techs);

        // Set service awal dari URL param atau service pertama
        if (!selectedServiceId && svcs.length > 0) {
          setSelectedServiceId(String(svcs[0].id));
        }
      } catch {
        setErrorMessage("Gagal memuat data layanan. Periksa koneksi Anda.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availableServices = services.filter((s) => {
    if (selectedCategory === "Semua") return true;
    return s.nama_kategori === selectedCategory;
  });

  const selectedService = services.find((s) => String(s.id) === String(selectedServiceId));
  const selectedTech = technicians.find((t) => String(t.id) === String(selectedTechId)) || null;

  const ongkirKunjungan = 15000;
  const totalBiaya = (Number(selectedService?.harga) || 0) + ongkirKunjungan;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName || !customerPhone || !customerAddress) {
      setErrorMessage("Mohon lengkapi nama, nomor telepon, dan alamat kunjungan.");
      return;
    }
    if (!complaint.trim()) {
      setErrorMessage("Silakan tuliskan ringkasan keluhan atau kerusakan perangkat Anda.");
      return;
    }
    if (!selectedServiceId) {
      setErrorMessage("Pilih layanan terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pelanggan_id: pelangganId || undefined,
          pelanggan_nama: customerName,
          pelanggan_no_hp: customerPhone,
          teknisi_id: selectedTechId !== "auto" ? Number(selectedTechId) : null,
          layanan_id: Number(selectedServiceId),
          tanggal_booking: visitDate,
          waktu_booking: visitTime.replace(/\s*WIB/i, "").trim(),
          alamat: customerAddress,
          keluhan: complaint,
          total_harga: totalBiaya,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        const dbBooking = json.data;
        setCreatedBooking({
          id: dbBooking.kode_booking,
          layanan: dbBooking.nama_layanan || selectedService?.nama_layanan,
          kategori: dbBooking.nama_kategori || selectedService?.nama_kategori,
          teknisi: dbBooking.teknisi_nama || (selectedTech ? selectedTech.nama : "Otomatis Teknisi Terdekat"),
          tanggal: visitDate,
          jam: visitTime,
          totalBiaya,
          status: "Menunggu Konfirmasi",
          keluhan: complaint,
        });
      } else {
        setErrorMessage(json.message || "Gagal membuat booking. Coba lagi.");
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage("Gagal menghubungkan ke server. Periksa koneksi Anda.");
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-sm">Memuat data layanan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Form Booking Teknisi Panggilan</h2>
        <p className="text-xs text-slate-500 mt-1">
          Lengkapi formulir di bawah ini untuk memesan kedatangan teknisi ke lokasi Anda di Kota Malang.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri */}
        <div className="lg:col-span-8 space-y-5">

          {/* Card 1: Layanan */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              1. Pilih Layanan Jasa
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    const match = services.find(
                      (s) => e.target.value === "Semua" || s.nama_kategori === e.target.value
                    );
                    if (match) setSelectedServiceId(String(match.id));
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-600 text-slate-800"
                >
                  <option value="Semua">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.nama_kategori}>{c.nama_kategori}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Jenis Layanan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-600 text-slate-800 font-semibold"
                >
                  {availableServices.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.nama_layanan} — Rp {Number(s.harga).toLocaleString("id-ID")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedService && (
              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {selectedService.deskripsi || "Layanan servis profesional oleh teknisi berpengalaman."}
              </p>
            )}
          </div>

          {/* Card 2: Teknisi & Jadwal */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              2. Teknisi & Jadwal Kunjungan
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Pilihan Teknisi</label>
              <select
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-600 text-slate-800"
              >
                <option value="auto">⚡ Otomatis Pilihkan Teknisi Terdekat yang Sedang Siaga</option>
                {technicians
                  .filter((t) => t.status_ketersediaan === "tersedia")
                  .map((t) => (
                    <option key={t.id} value={String(t.id)}>
                      {t.nama} — {t.layanan?.[0]?.nama_kategori || "Teknisi Umum"} ⭐ {t.rating || "4.8"}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tanggal Kunjungan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={visitDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Waktu Kunjungan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-600 text-slate-800"
                  >
                    <option value="09:00 WIB">Pagi (09:00 WIB)</option>
                    <option value="10:00 WIB">Pagi (10:00 WIB)</option>
                    <option value="11:30 WIB">Siang (11:30 WIB)</option>
                    <option value="13:30 WIB">Siang (13:30 WIB)</option>
                    <option value="15:30 WIB">Sore (15:30 WIB)</option>
                    <option value="17:00 WIB">Sore (17:00 WIB)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Data Pemesan */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              3. Data Pemesan & Alamat Kunjungan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Alamat Rumah / Lokasi Servis <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Jl. Contoh No. 1, Kec. Klojen, Kota Malang"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Detail Keluhan Kerusakan <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                placeholder="Contoh: Laptop mati total tidak ada respon daya, monitor garis-garis, dll."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs sticky top-24 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Ringkasan Pemesanan
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Layanan:</span>
                <p className="font-semibold text-slate-900">{selectedService?.nama_layanan || "—"}</p>
                {selectedService && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">
                    {selectedService.nama_kategori}
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px]">Jadwal:</span>
                <p className="font-medium text-slate-800">{visitDate} ({visitTime})</p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px]">Teknisi:</span>
                <p className="font-medium text-slate-800">
                  {selectedTechId === "auto" ? "Otomatis Teknisi Terdekat" : (selectedTech?.nama || "—")}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Jasa</span>
                  <span>Rp {Number(selectedService?.harga || 0).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ongkir Kunjungan</span>
                  <span>Rp {ongkirKunjungan.toLocaleString("id-ID")}</span>
                </div>
                <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Bayar</span>
                  <span className="text-blue-600">Rp {totalBiaya.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  Bayar di Tempat (COD)
                </p>
                <p className="text-[10px] text-slate-500">
                  Pembayaran tunai/transfer setelah servis selesai dikerjakan.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedServiceId}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Konfirmasi & Buat Pesanan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Modal Sukses Booking */}
      {createdBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Booking Berhasil Dikonfirmasi!</h3>
                  <p className="text-[11px] text-slate-500">
                    Kode Booking: <strong className="text-blue-600">{createdBooking.id}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push("/pelanggan/riwayat-booking")}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">
                  {createdBooking.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Layanan:</span>
                <strong className="text-slate-800">{createdBooking.layanan}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Teknisi:</span>
                <strong className="text-slate-800">{createdBooking.teknisi}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jadwal:</span>
                <span className="text-slate-800 font-medium">
                  {createdBooking.tanggal} ({createdBooking.jam})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Biaya:</span>
                <strong className="text-blue-600 text-sm">
                  Rp {createdBooking.totalBiaya.toLocaleString("id-ID")}
                </strong>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Teknisi,%20saya%20sudah%20melakukan%20booking%20kode%20${createdBooking.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi Teknisi via WhatsApp</span>
              </a>

              <Link
                href="/pelanggan/riwayat-booking"
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors"
              >
                Lihat Riwayat Booking
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PelangganBookingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    }>
      <CustomerBookingForm />
    </Suspense>
  );
}
