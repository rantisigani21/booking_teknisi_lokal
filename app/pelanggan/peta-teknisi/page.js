"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Search,
  Star,
  Wrench,
  Navigation,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  Loader2,
  AlertCircle,
  Clock,
  Phone,
} from "lucide-react";
import { calculateDistance } from "@/components/pelanggan/TeknisiMap";

// Dynamic import untuk Leaflet Map agar tidak terjadi issue SSR window is not defined
const TeknisiMap = dynamic(
  () => import("@/components/pelanggan/TeknisiMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-xs border border-slate-200">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
        <span>Memuat peta interaktif...</span>
      </div>
    ),
  }
);

export default function PetaTeknisiPage() {
  const router = useRouter();

  // State data
  const [technicians, setTechnicians] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedTechId, setSelectedTechId] = useState(null);

  // Lokasi Pelanggan (Default: Makassar Pusat / Panakkukang)
  const [customerLocation, setCustomerLocation] = useState({
    lat: -5.147665,
    lng: 119.432731,
    address: "Panakkukang, Kota Makassar",
  });

  // Ambil profil pelanggan jika memiliki alamat default
  useEffect(() => {
    try {
      const raw = localStorage.getItem("customer_auth");
      if (raw) {
        const u = JSON.parse(raw);
        if (u.alamat) {
          setCustomerLocation((prev) => ({
            ...prev,
            address: u.alamat,
          }));
        }
      }
    } catch {}

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [techRes, catRes] = await Promise.all([
          fetch("/api/teknisi?status_ketersediaan=tersedia"),
          fetch("/api/kategori-jasa?status=aktif"),
        ]);
        const [techJson, catJson] = await Promise.all([
          techRes.json(),
          catRes.json(),
        ]);

        if (techJson.success) setTechnicians(techJson.data || []);
        if (catJson.success) setCategories(catJson.data || []);
      } catch {
        setError("Gagal memuat data teknisi. Periksa koneksi Anda.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hitung jarak dan filter teknisi
  const sortedAndFilteredTechs = useMemo(() => {
    return technicians
      .map((tech) => {
        const distance =
          tech.latitude && tech.longitude
            ? calculateDistance(
                customerLocation.lat,
                customerLocation.lng,
                Number(tech.latitude),
                Number(tech.longitude)
              )
            : null;
        return { ...tech, distance };
      })
      .filter((tech) => {
        // Filter kategori
        const matchesCategory =
          selectedCategory === "Semua" ||
          (tech.layanan &&
            tech.layanan.some(
              (l) => l.nama_kategori === selectedCategory
            ));

        // Filter pencarian
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          (tech.nama || "").toLowerCase().includes(q) ||
          (tech.alamat || "").toLowerCase().includes(q) ||
          (tech.deskripsi || "").toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
  }, [technicians, customerLocation, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Navigation className="w-3.5 h-3.5" />
            Pencarian Berbasis Lokasi & Jarak Real-Time
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Peta Mitra Teknisi Terdekat
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Lihat sebaran posisi teknisi resmi yang siap melakukan kunjungan servis langsung ke lokasi Anda.
          </p>
        </div>

        <Link
          href="/pelanggan/booking"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Form Booking Langsung</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari teknisi berdasarkan nama, keahlian, atau area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="font-medium truncate max-w-[220px]">
              {customerLocation.address}
            </span>
          </div>
        </div>

        {/* Tab Kategori */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedCategory("Semua")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === "Semua"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Semua Teknisi ({technicians.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.nama_kategori)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === c.nama_kategori
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {c.nama_kategori}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Grid: Map + List Teknisi Terdekat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: List Teknisi Terurut berdasarkan Jarak (5 Kolom) */}
        <div className="lg:col-span-5 space-y-3 order-2 lg:order-1">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Terdekat ({sortedAndFilteredTechs.length})
            </h3>
            <span className="text-[11px] text-slate-500">
              Urut berdasarkan jarak
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse space-y-2"
                >
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : sortedAndFilteredTechs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs">
              <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Tidak ada teknisi cocok</p>
              <p className="text-slate-400 mt-1">Coba ubah kata kunci atau kategori filter</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {sortedAndFilteredTechs.map((tech) => {
                const isSelected = selectedTechId === tech.id;
                return (
                  <div
                    key={tech.id}
                    onClick={() => setSelectedTechId(tech.id)}
                    className={`bg-white border rounded-xl p-4 shadow-xs transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-100 bg-blue-50/20"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {(tech.nama || "TK").slice(0, 2).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {tech.nama}
                          </h4>
                          {tech.distance !== null && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold shrink-0">
                              ~{tech.distance} km
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-blue-600 font-medium truncate mt-0.5">
                          {tech.layanan?.[0]?.nama_kategori || "Teknisi Komputer & Elektronik"}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                          <span className="flex items-center font-semibold text-amber-600">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                            {tech.rating || "4.8"}
                          </span>
                          <span>•</span>
                          <span className="truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                            <span className="truncate">{tech.alamat || "Kota Makassar"}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Siaga Kunjungan
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/pelanggan/booking?techId=${tech.id}`);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>Pesan Teknisi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Peta Interaktif Leaflet (7 Kolom) */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-2">
          <div className="h-[480px] lg:h-[580px] rounded-xl overflow-hidden shadow-xs border border-slate-200">
            <TeknisiMap
              technicians={sortedAndFilteredTechs}
              customerLocation={customerLocation}
              onCustomerLocationChange={(newLoc) => setCustomerLocation(newLoc)}
              selectedTechId={selectedTechId}
              onSelectTech={(tech) => setSelectedTechId(tech.id)}
            />
          </div>

          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3 flex items-center gap-3 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Titik biru adalah lokasi Anda. Anda dapat mengklik sembarang titik di peta atau menekan tombol <strong>Lokasi Saya</strong> untuk memperbarui titik acuan jarak.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
