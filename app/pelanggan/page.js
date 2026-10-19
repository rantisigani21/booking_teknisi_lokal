"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  CalendarCheck,
  ArrowRight,
  Monitor,
  Laptop,
  Printer,
  Wifi,
  Tv,
  Loader2,
  AlertCircle,
} from "lucide-react";

const categoryIcons = {
  "Teknisi Komputer": Monitor,
  "Teknisi Laptop": Laptop,
  "Teknisi Printer": Printer,
  "Teknisi Jaringan": Wifi,
  "Teknisi Elektronik": Tv,
};

function ServiceSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs animate-pulse">
      <div className="h-3 bg-slate-200 rounded w-1/3 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-full mb-1" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-7 bg-slate-200 rounded w-1/4" />
      </div>
    </div>
  );
}

export default function PelangganDashboardPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userNama, setUserNama] = useState("Pelanggan");

  useEffect(() => {
    // Ambil info user dari localStorage
    try {
      const raw = localStorage.getItem("customer_auth");
      if (raw) {
        const u = JSON.parse(raw);
        if (u.nama) setUserNama(u.nama.split(" ")[0]);
      }
    } catch {}

    // Fetch semua data awal secara paralel
    const fetchAll = async () => {
      setIsLoading(true);
      setError("");
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

        if (catJson.success) setCategories(catJson.data || []);
        if (svcJson.success) setServices(svcJson.data || []);
        if (techJson.success) setTechnicians(techJson.data || []);
      } catch {
        setError("Gagal memuat data. Periksa koneksi Anda.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesCat =
      selectedCategory === "Semua" ||
      service.nama_kategori === selectedCategory;
    const matchesSearch =
      service.nama_layanan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.deskripsi || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.nama_kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const availableTechs = technicians.filter(
    (t) => t.status_ketersediaan === "tersedia"
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Layanan Teknisi Panggilan Resmi Area Kota Malang
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Halo, {userNama}! 👋
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Pilih layanan servis komputer, laptop, printer, dan elektronik panggilan. Teknisi siap datang langsung ke alamat Anda.
          </p>
        </div>

        <Link
          href="/pelanggan/booking"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Buat Pesanan Sekarang</span>
        </Link>
      </div>

      {/* 4 Kartu Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Layanan Tersedia</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {isLoading ? "—" : services.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {isLoading ? "..." : `${categories.length} Kategori Jasa`}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Mitra Teknisi Siaga</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {isLoading ? "—" : availableTechs.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Siap Kunjungan</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Garansi Servis</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">30 Hari</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Jaminan Uang Kembali</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Sistem Pembayaran</span>
          <p className="text-xl font-bold text-emerald-600 mt-1 truncate">Bayar di Tempat</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Tunai atau Transfer</span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Filter Kategori & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari layanan (LCD laptop, printer buntu, PC lambat)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600"
          />
        </div>

        {/* Tab Kategori */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedCategory("Semua")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === "Semua"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Semua Kategori
          </button>
          {categories.map((c) => {
            const Icon = categoryIcons[c.nama_kategori];
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.nama_kategori)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === c.nama_kategori
                    ? "bg-blue-600 text-white font-semibold shadow-xs"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {c.nama_kategori}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Katalog Layanan */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Katalog Layanan Jasa ({isLoading ? "..." : filteredServices.length})
          </h3>
          <span className="text-xs text-slate-500">
            Kategori: <strong className="text-blue-600">{selectedCategory}</strong>
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <ServiceSkeleton key={i} />)}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Layanan tidak ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci atau kategori</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold border border-blue-100">
                      {service.nama_kategori}
                    </span>
                    <span className="text-[10px] text-slate-400">#{service.id}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {service.nama_layanan}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                    {service.deskripsi || "Layanan servis profesional oleh teknisi berpengalaman."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tarif Servis</span>
                    <span className="text-sm font-extrabold text-blue-600">
                      Rp {Number(service.harga).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push(`/pelanggan/booking?serviceId=${service.id}`)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Pesan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid Mitra Teknisi Terdekat */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-slate-900">
          Mitra Teknisi Siaga ({isLoading ? "..." : availableTechs.length})
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : availableTechs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-sm text-slate-500">Belum ada teknisi yang tersedia saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableTechs.slice(0, 3).map((tech) => (
              <div
                key={tech.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {(tech.nama || "TK").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{tech.nama}</h4>
                      <span className="text-[10px] font-bold text-amber-600 flex items-center shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                        {tech.rating || "4.8"}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-600 font-medium truncate mt-0.5">
                      {tech.layanan?.[0]?.nama_kategori || "Teknisi Umum"}
                    </p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span className="truncate">{tech.alamat || "Kota Malang"}</span>
                      <span>•</span>
                      <span>{tech.jumlah_selesai || 0} Servis</span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Siap Kunjungan
                  </span>
                  <button
                    type="button"
                    onClick={() => router.push(`/pelanggan/booking?techId=${tech.id}`)}
                    className="px-3 py-1 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Pilih Teknisi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
