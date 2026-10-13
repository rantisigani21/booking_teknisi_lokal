"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Check, ShieldCheck } from "lucide-react";

export default function PelangganProfilPage() {
  const [profile, setProfile] = useState({
    nama: "Siti Rahmawati",
    email: "siti.rahma@gmail.com",
    noHp: "0812-3456-7890",
    alamat: "Jl. Melati No. 14, Lowokwaru, Kota Malang",
    role: "Pelanggan Terdaftar",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("customer_auth");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setProfile((prev) => ({ ...prev, ...u }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("customer_auth", JSON.stringify(profile));
    } catch (err) {
      console.error(err);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3500);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header Senada dengan Admin */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profil Pelanggan</h2>
        <p className="text-xs text-slate-500 mt-1">
          Kelola informasi identitas akun, nomor WhatsApp, dan alamat penjemputan/servis Anda.
        </p>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-xs sm:text-sm animate-in fade-in">
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-semibold">Perubahan Berhasil Disimpan!</p>
            <p className="text-xs text-emerald-700">Data profil pelanggan telah diperbarui di sistem.</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-xs">
              {profile.nama ? profile.nama.slice(0, 2).toUpperCase() : "SR"}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h4 className="font-semibold text-slate-900 text-sm">{profile.nama}</h4>
              <p className="text-xs text-slate-500">
                Akun resmi pemesan layanan jasa servis teknisi lokal Kota Malang.
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
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
