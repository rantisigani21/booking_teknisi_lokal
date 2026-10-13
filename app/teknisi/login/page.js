"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Briefcase,
} from "lucide-react";

export default function TeknisiLoginPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("login");

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register states
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regSkill, setRegSkill] = useState("Teknisi Laptop & Komputer");
  const [regLocation, setRegLocation] = useState("Kec. Klojen, Malang");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUseDemo = () => {
    setLoginEmail("agus@teknisi.id");
    setLoginPassword("teknisi123");
    setErrorMessage("");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage("Silakan masukkan email / no HP dan kata sandi.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const techData = {
        nama: loginEmail.includes("agus") ? "Agus Prasetyo" : "Mitra Teknisi",
        email: loginEmail,
        noHp: "0812-4455-6677",
        keahlian: "Teknisi Laptop & Komputer",
        lokasi: "Kec. Klojen, Malang",
        rating: 4.9,
        isOnline: true,
        status: "Aktif",
      };

      try {
        localStorage.setItem("technician_auth", JSON.stringify(techData));
      } catch (err) {
        console.error(err);
      }

      setSuccessMessage("Login berhasil! Mengarahkan ke dashboard kerja...");
      setTimeout(() => {
        router.push("/teknisi");
      }, 700);
    }, 600);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!regName.trim() || !regPhone.trim() || !regEmail.trim()) {
      setErrorMessage("Mohon lengkapi seluruh kolom formulir.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newTech = {
        nama: regName,
        email: regEmail,
        noHp: regPhone,
        keahlian: regSkill,
        lokasi: regLocation,
        rating: 5.0,
        isOnline: true,
        status: "Aktif",
      };

      try {
        localStorage.setItem("technician_auth", JSON.stringify(newTech));
      } catch (err) {
        console.error(err);
      }

      setSuccessMessage("Pendaftaran mitra berhasil! Anda siap menerima pesanan.");
      setTimeout(() => {
        router.push("/teknisi");
      }, 900);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Brand Header Non-Klik */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2.5 text-slate-900 mb-4 select-none">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="block text-base font-bold text-slate-900 leading-tight">
              Booking Teknisi Lokal
            </span>
            <span className="block text-xs text-blue-600 font-semibold">
              Portal Mitra Teknisi Lapangan
            </span>
          </div>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {activeTab === "login" ? "Masuk Portal Mitra Teknisi" : "Pendaftaran Mitra Teknisi Baru"}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {activeTab === "login"
            ? "Kelola pesanan servis panggilan, update lokasi, dan pantau penghasilan."
            : "Bergabung menjadi mitra teknisi panggilan resmi di area Kota Malang."}
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-5 sm:px-8 rounded-xl border border-slate-200 shadow-xs">
          
          {/* Tab Selector: Masuk / Daftar */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === "login"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === "register"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Daftar Mitra Baru
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN TEKNISI */}
          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email atau Nomor WhatsApp Teknisi
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="agus@teknisi.id"
                    disabled={isLoading}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Hubungi Koordinator IT Admin untuk reset kata sandi teknisi.")}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Masuk...</span>
                    </>
                  ) : (
                    <span>Masuk ke Panel Teknisi</span>
                  )}
                </button>
              </div>

              {/* Demo Helper Box */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-slate-50 -mx-5 -mb-6 px-5 py-3 rounded-b-xl">
                <div>
                  <p className="font-medium text-slate-800">Akun Mitra Demo:</p>
                  <p className="text-[11px] text-slate-500">agus@teknisi.id / teknisi123</p>
                </div>
                <button
                  type="button"
                  onClick={handleUseDemo}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-md hover:bg-slate-50"
                >
                  Isi Contoh
                </button>
              </div>
            </form>
          ) : (
            /* TAB 2: REGISTER TEKNISI */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap Teknisi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Agus Prasetyo"
                    className="w-full pl-9 pr-3 py-2 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    No. WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0812-4455-6677"
                    className="w-full px-3 py-2 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Aktif <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="agus@email.com"
                    className="w-full px-3 py-2 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
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
                    value={regSkill}
                    onChange={(e) => setRegSkill(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs text-slate-800 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-600"
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
                  Wilayah / Area Standby <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs text-slate-800 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="Kec. Klojen, Malang">Kec. Klojen, Malang</option>
                    <option value="Kec. Lowokwaru, Malang">Kec. Lowokwaru, Malang</option>
                    <option value="Kec. Blimbing, Malang">Kec. Blimbing, Malang</option>
                    <option value="Kec. Sukun, Malang">Kec. Sukun, Malang</option>
                    <option value="Kec. Kedungkandang, Malang">Kec. Kedungkandang, Malang</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 huruf"
                    className="w-full px-3 py-2 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ulangi Sandi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi"
                    className="w-full px-3 py-2 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mendaftarkan Mitra...</span>
                    </>
                  ) : (
                    <span>Daftar Sebagai Mitra Teknisi</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; 2025 Booking Teknisi Lokal. Portal Khusus Petugas Mitra Lapangan.
        </p>
      </div>
    </div>
  );
}
