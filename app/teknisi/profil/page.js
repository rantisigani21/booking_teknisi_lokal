"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Check,
  ShieldCheck,
  Edit3,
  LogOut,
  ChevronLeft,
  CalendarCheck,
  History,
  Power,
} from "lucide-react";

export default function TeknisiProfilPage() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    nama: "Agus Prasetyo",
    email: "agus@teknisi.id",
    noHp: "0812-4455-6677",
    keahlian: "Teknisi Laptop & Komputer",
    lokasi: "Kec. Klojen, Malang",
    rating: 4.9,
    jumlahSelesai: 38,
    status: "Aktif",
    isOnline: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("technician_auth");
      if (saved) {
        const t = JSON.parse(saved);
        setProfile((prev) => ({
          ...prev,
          ...t,
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("technician_auth", JSON.stringify(profile));
    } catch (err) {
      console.error(err);
    }
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun mitra teknisi?")) {
      try {
        localStorage.removeItem("technician_auth");
      } catch (e) {
        console.error(e);
      }
      router.push("/teknisi/login");
    }
  };

  return (
    <div className="space-y-6">
        {/* Breadcrumb */}
        <div>
          <Link
            href="/teknisi"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda Teknisi</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Profil Mitra Teknisi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Informasi identitas kerja, spesialisasi keahlian, dan area jangkauan servis lapangan Anda.
          </p>
        </div>

        {/* Notifikasi Simpan Sukses */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs sm:text-sm animate-in fade-in">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold">Profil Berhasil Diperbarui!</p>
              <p className="text-xs text-emerald-700">Data profil mitra telah disinkronkan ke sistem.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Kolom Kiri: Kartu Identitas & Statistik */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-xs">
              <div className="w-20 h-20 rounded-full bg-slate-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-3 shadow-xs">
                {profile.nama ? profile.nama.slice(0, 2).toUpperCase() : "TK"}
              </div>
              <h2 className="text-base font-bold text-slate-900">{profile.nama}</h2>
              <p className="text-xs text-blue-600 font-medium">{profile.keahlian}</p>

              <div className="mt-2.5 flex items-center justify-center gap-1 text-xs font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{profile.rating || 4.9} Rating Kepuasan</span>
              </div>

              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Mitra Terverifikasi Resmi
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="block text-base font-bold text-slate-900">
                    {profile.jumlahSelesai || 38}
                  </span>
                  <span className="text-[10px] text-slate-500">Servis Selesai</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="block text-base font-bold text-emerald-600">
                    100%
                  </span>
                  <span className="text-[10px] text-slate-500">Tingkat Respon</span>
                </div>
              </div>
            </div>

            {/* Quick Menu */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs space-y-1 text-xs">
              <Link
                href="/teknisi/booking"
                className="flex items-center justify-between p-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">Booking Aktif Lapangan</span>
                </div>
                <span className="text-slate-400">&rarr;</span>
              </Link>

              <Link
                href="/teknisi/riwayat"
                className="flex items-center justify-between p-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">Riwayat & Laporan Servis</span>
                </div>
                <span className="text-slate-400">&rarr;</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span className="font-medium">Keluar dari Akun</span>
                </div>
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Detail Profile & Form Edit Profile (extends Edit Profile) */}
          <div className="md:col-span-8">
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isEditing ? "Edit Profil Mitra Teknisi" : "Informasi Profil Mitra"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEditing
                      ? "Perbarui nomor kontak, spesialisasi, atau area tugas Anda."
                      : "Data ini digunakan untuk rekomendasi teknisi terdekat ke pelanggan."}
                  </p>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Ubah Profil</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                /* FORM EDIT PROFILE TEKNISI */
                <form onSubmit={handleSaveProfile} className="mt-5 space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={profile.nama}
                        onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={profile.noHp}
                        onChange={(e) => setProfile({ ...profile, noHp: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Alamat Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Bidang Keahlian Utama <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={profile.keahlian}
                        onChange={(e) => setProfile({ ...profile, keahlian: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-600 text-slate-800"
                      >
                        <option value="Teknisi Laptop & Komputer">Teknisi Laptop & Komputer</option>
                        <option value="Teknisi Printer & Fotokopi">Teknisi Printer & Fotokopi</option>
                        <option value="Teknisi Jaringan & WiFi">Teknisi Jaringan & WiFi</option>
                        <option value="Teknisi Elektronik & Audio">Teknisi Elektronik & Audio</option>
                        <option value="Teknisi Komputer & Server">Teknisi Komputer & Server</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Wilayah Standby Tugas <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={profile.lokasi}
                        onChange={(e) => setProfile({ ...profile, lokasi: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-600 text-slate-800"
                      >
                        <option value="Kec. Klojen, Malang">Kec. Klojen, Malang</option>
                        <option value="Kec. Lowokwaru, Malang">Kec. Lowokwaru, Malang</option>
                        <option value="Kec. Blimbing, Malang">Kec. Blimbing, Malang</option>
                        <option value="Kec. Sukun, Malang">Kec. Sukun, Malang</option>
                        <option value="Kec. Kedungkandang, Malang">Kec. Kedungkandang, Malang</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              ) : (
                /* READ-ONLY VIEW PROFILE TEKNISI */
                <div className="mt-5 space-y-3.5 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nama Lengkap Mitra</span>
                      <strong className="text-slate-900">{profile.nama}</strong>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Spesialisasi Keahlian</span>
                      <strong className="text-blue-600">{profile.keahlian}</strong>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">WhatsApp / No. HP</span>
                      <strong className="text-slate-900">{profile.noHp}</strong>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Email Akun</span>
                      <strong className="text-slate-900">{profile.email}</strong>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Wilayah Operasional Tugas</span>
                      <strong className="text-slate-900">{profile.lokasi}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
    </div>
  );
}
