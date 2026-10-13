"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  CalendarCheck,
  ArrowRight,
  Monitor,
  Laptop,
  Printer,
  Wifi,
  Tv,
  CheckCircle2,
  Users,
} from "lucide-react";

import { initialServices, initialCategories, initialTechnicians } from "@/lib/dummyData";

const categoryIcons = {
  "Teknisi Komputer": Monitor,
  "Teknisi Laptop": Laptop,
  "Teknisi Printer": Printer,
  "Teknisi Jaringan": Wifi,
  "Teknisi Elektronik": Tv,
};

export default function PelangganDashboardPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedLocation, setSelectedLocation] = useState("Semua Lokasi");

  const locations = [
    "Semua Lokasi",
    "Kec. Klojen",
    "Kec. Lowokwaru",
    "Kec. Blimbing",
    "Kec. Sukun",
    "Kec. Kedungkandang",
  ];

  const filteredServices = initialServices.filter((service) => {
    const matchesCat =
      selectedCategory === "Semua" || service.kategori === selectedCategory;
    const matchesSearch =
      service.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const nearbyTechnicians = initialTechnicians.filter((t) => {
    const matchesLoc =
      selectedLocation === "Semua Lokasi" ||
      t.lokasi.toLowerCase() === selectedLocation.toLowerCase();
    return t.status === "Aktif" && matchesLoc;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner Senada dengan Admin */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Layanan Teknisi Panggilan Resmi Area Kota Malang
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Selamat Datang di Portal Pelanggan
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Pilih layanan servis komputer, laptop, printer, dan elektronik panggilan. Teknisi siap datang langsung ke alamat rumah Anda.
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

      {/* 4 Kartu Statistik Senada dengan Admin */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Layanan Tersedia</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{initialServices.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">5 Kategori Jasa</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Mitra Teknisi Siaga</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {initialTechnicians.filter((t) => t.status === "Aktif").length}
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

      {/* Filter Kategori & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari keluhan (LCD laptop, printer buntu, PC lambat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="text-xs text-slate-500 shrink-0">Wilayah:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Kategori Jasa (extends Kategori Jasa) */}
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
          {initialCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.nama)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === c.nama
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {c.nama}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Katalog Layanan (extends Lihat/Pilih Layanan) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Katalog Layanan Jasa ({filteredServices.length})
          </h3>
          <span className="text-xs text-slate-500">
            Kategori: <strong className="text-blue-600">{selectedCategory}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold border border-blue-100">
                    {service.kategori}
                  </span>
                  <span className="text-[10px] text-slate-400">{service.id}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {service.nama}
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  {service.deskripsi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Tarif Servis</span>
                  <span className="text-sm font-extrabold text-blue-600">
                    Rp {service.harga.toLocaleString("id-ID")}
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
      </div>

      {/* Grid Rekomendasi Teknisi Terdekat (extends Teknisi Terdekat) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Mitra Teknisi Terdekat di Kota Malang
          </h3>
          <span className="text-xs text-slate-500">
            Wilayah: <strong className="text-slate-800">{selectedLocation}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearbyTechnicians.slice(0, 3).map((tech) => (
            <div
              key={tech.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {tech.nama.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{tech.nama}</h4>
                    <span className="text-[10px] font-bold text-amber-600 flex items-center shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                      {tech.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-600 font-medium truncate mt-0.5">
                    {tech.keahlian}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{tech.lokasi}</span>
                    <span>•</span>
                    <span>{tech.jumlahSelesai} Servis</span>
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
      </div>
    </div>
  );
}
