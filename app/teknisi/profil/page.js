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
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function TeknisiProfilPage() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    userId: null,
    techId: null,
    nama: "",
    email: "",
    noHp: "",
    keahlian: "",
    lokasi: "",
    rating: 4.8,
    jumlahSelesai: 0,
    status: "Aktif",
    isOnline: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setErrorMessage("");

      let currentTechId = null;
      let currentUserId = null;
      let localData = null;

      try {
        const saved = localStorage.getItem("technician_auth");
        if (saved) {
          localData = JSON.parse(saved);
          if (localData.teknisi?.id) currentTechId = localData.teknisi.id;
          if (localData.techId) currentTechId = localData.techId;
          if (localData.id) currentUserId = localData.id;
        }
      } catch (e) {
        console.error(e);
      }

      // Fetch dari /api/auth/me
      try {
        const meRes = await fetch("/api/auth/me");
        const meJson = await meRes.json();
        if (meRes.ok && meJson.success && meJson.data) {
          const u = meJson.data;
          currentUserId = u.id;
          currentTechId = u.teknisi?.id || currentTechId;

          setProfile({
            userId: u.id,
            techId: currentTechId,
            nama: u.nama || "",
            email: u.email || "",
            noHp: u.no_hp || "",
            keahlian: u.teknisi?.deskripsi || localData?.keahlian || "Teknisi Laptop & Komputer",
            lokasi: u.teknisi?.alamat || localData?.lokasi || "Kota Makassar",
            rating: 4.8,
            jumlahSelesai: 0,
            status: u.status === "aktif" ? "Aktif" : u.status,
            isOnline: u.teknisi?.status_ketersediaan === "tersedia",
          });
        } else if (localData) {
          setProfile((prev) => ({
            ...prev,
            ...localData,
          }));
        }
      } catch {
        if (localData) {
          setProfile((prev) => ({
            ...prev,
            ...localData,
          }));
        }
      }

      // Ambil total order selesai dari riwayat booking jika techId tersedia
      if (currentTechId) {
        try {
          const bRes = await fetch(`/api/booking?teknisi_id=${currentTechId}`);
          const bJson = await bRes.json();
          if (bJson.success && Array.isArray(bJson.data)) {
            const completed = bJson.data.filter(
              (b) => (b.status || "").toLowerCase() === "selesai"
            ).length;
            setProfile((prev) => ({ ...prev, jumlahSelesai: completed }));
          }
        } catch (e) {
          console.error("Gagal load booking count:", e);
        }
      }

      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. Update data User (nama, no_hp)
      if (profile.userId) {
        await fetch(`/api/users/${profile.userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama: profile.nama,
            no_hp: profile.noHp,
          }),
        });
      }

      // 2. Update data Teknisi (alamat, deskripsi)
      if (profile.techId) {
        await fetch(`/api/teknisi/${profile.techId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alamat: profile.lokasi,
            deskripsi: profile.keahlian,
            status_ketersediaan: profile.isOnline ? "tersedia" : "tidak_tersedia",
          }),
        });
      }

      // 3. Simpan ke localStorage
      const updatedAuth = {
        id: profile.userId,
        techId: profile.techId,
        nama: profile.nama,
        email: profile.email,
        no_hp: profile.noHp,
        deskripsi: profile.keahlian,
        alamat: profile.lokasi,
        keahlian: profile.keahlian,
        lokasi: profile.lokasi,
        status_ketersediaan: profile.isOnline ? "tersedia" : "tidak_tersedia",
        rating: profile.rating,
      };
      localStorage.setItem("technician_auth", JSON.stringify(updatedAuth));
      window.dispatchEvent(new Event("storage"));

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch {
      setErrorMessage("Gagal menyimpan perubahan ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun mitra teknisi?")) {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        localStorage.removeItem("technician_auth");
      } catch (e) {
        console.error(e);
      }
      router.push("/teknisi/login");
    }
  };

  const initials = profile.nama
    ? profile.nama
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")
    : "TK";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/teknisi"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda Teknisi</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Profil Mitra Teknisi
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Informasi identitas kerja, spesialisasi keahlian, dan area operasional servis panggilan Anda.
        </p>
      </div>

      {/* Notifikasi Simpan Sukses */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs sm:text-sm animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold">Perubahan Berhasil Disimpan!</p>
            <p className="text-xs text-emerald-700">Data profil mitra telah diperbarui di database sistem.</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
          <span>Memuat data profil teknisi...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Kartu Identitas & Statistik */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
                {initials}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{profile.nama}</h3>
                <p className="text-xs text-blue-600 font-medium mt-0.5">{profile.keahlian}</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mitra Terverifikasi Resmi</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-left text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Rating Reputasi</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {profile.rating} / 5.0
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Servis Selesai</span>
                  <span className="font-bold text-blue-600 mt-0.5 block">
                    {profile.jumlahSelesai} Order
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Akun (Logout)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Edit Data Profil */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Informasi Data Akun & Lapangan</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Perbarui nomor kontak dan alamat jangkauan servis.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Batal" : "Edit Profil"}</span>
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Lengkap Mitra <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      value={profile.nama}
                      onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-500 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Akun (Login)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        disabled
                        value={profile.email}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        disabled={!isEditing}
                        value={profile.noHp}
                        onChange={(e) => setProfile({ ...profile, noHp: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-500 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Spesialisasi Keahlian Bidang Jasa <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      value={profile.keahlian}
                      onChange={(e) => setProfile({ ...profile, keahlian: e.target.value })}
                      placeholder="Contoh: Teknisi Komputer, Laptop & Jaringan"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-500 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Area Jangkauan Servis / Alamat Posko <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <textarea
                      rows={2}
                      required
                      disabled={!isEditing}
                      value={profile.lokasi}
                      onChange={(e) => setProfile({ ...profile, lokasi: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-500 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <span>Simpan Perubahan</span>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
