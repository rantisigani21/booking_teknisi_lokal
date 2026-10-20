"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Check,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function PelangganProfilPage() {
  const [profile, setProfile] = useState({
    id: null,
    nama: "",
    email: "",
    noHp: "",
    alamat: "",
    role: "Pelanggan Terdaftar",
  });

  const [stats, setStats] = useState({
    total: 0,
    aktif: 0,
    selesai: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      let currentId = null;
      let localData = null;

      // 1. Coba baca dari localStorage dulu
      try {
        const savedUser = localStorage.getItem("customer_auth");
        if (savedUser) {
          localData = JSON.parse(savedUser);
          if (localData.id) currentId = localData.id;
        }
      } catch (e) {
        console.error(e);
      }

      // 2. Sinkronkan dengan API /api/auth/me atau /api/users/[id]
      try {
        const meRes = await fetch("/api/auth/me");
        const meJson = await meRes.json();

        if (meRes.ok && meJson.success && meJson.data) {
          const u = meJson.data;
          currentId = u.id;
          setProfile({
            id: u.id,
            nama: u.nama || "",
            email: u.email || "",
            noHp: u.no_hp || "",
            alamat: localData?.alamat || u.alamat || "Kota Makassar",
            role: "Pelanggan Terdaftar",
          });
        } else if (localData) {
          // Fallback ke data localStorage
          setProfile({
            id: localData.id || null,
            nama: localData.nama || "",
            email: localData.email || "",
            noHp: localData.no_hp || localData.noHp || "",
            alamat: localData.alamat || "Kota Makassar",
            role: "Pelanggan Terdaftar",
          });
        }
      } catch {
        if (localData) {
          setProfile({
            id: localData.id || null,
            nama: localData.nama || "",
            email: localData.email || "",
            noHp: localData.no_hp || localData.noHp || "",
            alamat: localData.alamat || "Kota Makassar",
            role: "Pelanggan Terdaftar",
          });
        }
      }

      // 3. Ambil statistik riwayat booking pelanggan jika ID tersedia
      if (currentId) {
        try {
          const bRes = await fetch(`/api/booking?pelanggan_id=${currentId}`);
          const bJson = await bRes.json();
          if (bJson.success && Array.isArray(bJson.data)) {
            const list = bJson.data;
            const aktifCount = list.filter((b) =>
              ["menunggu", "diterima", "diproses"].includes((b.status || "").toLowerCase())
            ).length;
            const selesaiCount = list.filter(
              (b) => (b.status || "").toLowerCase() === "selesai"
            ).length;

            setStats({
              total: list.length,
              aktif: aktifCount,
              selesai: selesaiCount,
            });
          }
        } catch (e) {
          console.error("Gagal memuat stats booking:", e);
        }
      }

      setIsLoading(false);
    };

    fetchProfileData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSavedSuccess(false);

    try {
      // Jika memiliki id, update ke backend users API
      if (profile.id) {
        const res = await fetch(`/api/users/${profile.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama: profile.nama,
            email: profile.email,
            no_hp: profile.noHp,
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          setErrorMessage(json.message || "Gagal memperbarui profil pengguna.");
          setIsSubmitting(false);
          return;
        }
      }

      // Perbarui juga data di localStorage
      const updatedAuth = {
        id: profile.id,
        nama: profile.nama,
        email: profile.email,
        no_hp: profile.noHp,
        noHp: profile.noHp,
        alamat: profile.alamat,
        role: profile.role,
      };
      localStorage.setItem("customer_auth", JSON.stringify(updatedAuth));
      window.dispatchEvent(new Event("storage"));

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3500);
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi saat menyimpan profil.");
    } finally {
      setIsSubmitting(false);
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
    : "PL";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profil Pelanggan</h2>
        <p className="text-xs text-slate-500 mt-1">
          Kelola informasi identitas akun, nomor WhatsApp, dan alamat penjemputan/servis Anda.
        </p>
      </div>

      {/* Stats Cards Ringkasan Booking */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs text-center">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Total Booking</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">
            {isLoading ? "—" : stats.total}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs text-center">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1.5">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Pesanan Aktif</p>
          <p className="text-lg font-bold text-amber-600 mt-0.5">
            {isLoading ? "—" : stats.aktif}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs text-center">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Servis Selesai</p>
          <p className="text-lg font-bold text-emerald-600 mt-0.5">
            {isLoading ? "—" : stats.selesai}
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs sm:text-sm animate-in fade-in">
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-semibold">Perubahan Berhasil Disimpan!</p>
            <p className="text-xs text-emerald-700">Data profil pelanggan telah diperbarui di database sistem.</p>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin mb-2 text-blue-600" />
            <span>Memuat data profil...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-xs shrink-0">
                {initials}
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h4 className="font-semibold text-slate-900 text-sm">
                  {profile.nama || "Pelanggan Terdaftar"}
                </h4>
                <p className="text-xs text-slate-500">
                  Akun resmi pemesan layanan jasa servis teknisi lokal Kota Makassar.
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[11px] font-medium mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  {profile.role}
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap Pelanggan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={profile.nama}
                    onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Pelanggan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={profile.noHp}
                    onChange={(e) => setProfile({ ...profile, noHp: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Alamat Kunjungan Default <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <textarea
                    required
                    rows={2}
                    value={profile.alamat}
                    onChange={(e) => setProfile({ ...profile, alamat: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
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
          </form>
        )}
      </div>
    </div>
  );
}
