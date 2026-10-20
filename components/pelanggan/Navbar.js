"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  MapPin,
  CalendarCheck,
  User,
  Menu,
  X,
  Phone,
  ChevronDown,
  ShieldCheck,
  Clock,
  LogIn,
} from "lucide-react";

export default function PelangganNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Panakkukang, Kota Makassar");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [customerUser, setCustomerUser] = useState(null);

  const locations = [
    "Panakkukang, Kota Makassar",
    "Ujung Pandang, Kota Makassar",
    "Tamalanrea, Kota Makassar",
    "Rappocini, Kota Makassar",
    "Mariso, Kota Makassar",
    "Bontoala, Kota Makassar",
  ];

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("customer_auth");
      if (savedUser) {
        setCustomerUser(JSON.parse(savedUser));
      } else {
        // Default customer session untuk kemudahan preview
        setCustomerUser({
          nama: "Siti Rahmawati",
          email: "siti.rahma@gmail.com",
          noHp: "0812-3456-7890",
          alamat: "Jl. Melati No. 14, Lowokwaru",
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Teknisi Terverifikasi & Bergaransi
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Layanan Panggilan Jam 08:00 - 20:00 WIB
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              Bantuan WA: 0812-3456-7890
            </a>
            <span className="text-slate-600">|</span>
            <Link
              href="/admin/login"
              className="hover:text-blue-400 text-slate-400 transition-colors"
            >
              Portal Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Booking Teknisi
                </span>
                <span className="block text-[11px] font-semibold text-blue-600 uppercase tracking-wider -mt-0.5">
                  Layanan Lokal Makassar
                </span>
              </div>
            </Link>

            {/* Location Selector (extends Lokasi) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="font-medium truncate max-w-[150px]">
                  {selectedLocation}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Pilih Wilayah Anda
                  </div>
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        selectedLocation === loc
                          ? "text-blue-600 font-semibold bg-blue-50/50"
                          : "text-slate-700"
                      }`}
                    >
                      <span>{loc}</span>
                      {selectedLocation === loc && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                pathname === "/"
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/#kategori-layanan"
              className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Kategori Jasa
            </Link>
            <Link
              href="/#teknisi-terdekat"
              className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Teknisi Terdekat
            </Link>
            <Link
              href="/riwayat-booking"
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === "/riwayat-booking"
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Riwayat Booking
            </Link>
          </nav>

          {/* Right Action: Booking Button & Profile / Login */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/booking"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Pesan Teknisi</span>
            </Link>

            {customerUser ? (
              <Link
                href="/profil"
                className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                  {customerUser.nama?.slice(0, 2).toUpperCase() || "PL"}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-800 leading-none">
                    {customerUser.nama}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Pelanggan</p>
                </div>
              </Link>
            ) : (
              <Link
                href="/masuk"
                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/booking"
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Pesan
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          {/* Location mobile selector */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <div>
                <p className="text-[10px] text-slate-400">Lokasi Layanan:</p>
                <p className="font-semibold text-slate-800">{selectedLocation}</p>
              </div>
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 text-xs">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg ${
                pathname === "/"
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/#kategori-layanan"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Kategori Jasa
            </Link>
            <Link
              href="/#teknisi-terdekat"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Teknisi Terdekat
            </Link>
            <Link
              href="/riwayat-booking"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg ${
                pathname === "/riwayat-booking"
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Riwayat Booking
            </Link>
            <Link
              href="/profil"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg ${
                pathname === "/profil"
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Profil Saya
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/admin/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Masuk Portal Admin &rarr;
            </Link>
            <span>Bantuan: 0812-3456-7890</span>
          </div>
        </div>
      )}
    </header>
  );
}
