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
} from "lucide-react";

export default function PelangganLoginPage() {
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
  const [regAddress, setRegAddress] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUseDemo = () => {
    setLoginEmail("siti.rahma@gmail.com");
    setLoginPassword("pelanggan123");
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
      const customerData = {
        nama: loginEmail.includes("siti") ? "Siti Rahmawati" : "Pelanggan Terdaftar",
        email: loginEmail,
        noHp: "0812-3456-7890",
        alamat: "Jl. Melati No. 14, Lowokwaru, Kota Malang",
        role: "Pelanggan Terdaftar",
      };

      try {
        localStorage.setItem("customer_auth", JSON.stringify(customerData));
      } catch (err) {
        console.error(err);
      }

      setSuccessMessage("Login berhasil! Mengarahkan ke dashboard...");
      setTimeout(() => {
        router.push("/pelanggan");
      }, 700);
    }, 600);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !regAddress.trim()) {
      setErrorMessage("Semua kolom formulir pendaftaran wajib diisi.");
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
      const newCustomer = {
        nama: regName,
        email: regEmail,
        noHp: regPhone,
        alamat: regAddress,
        role: "Pelanggan Terdaftar",
      };

      try {
        localStorage.setItem("customer_auth", JSON.stringify(newCustomer));
      } catch (err) {
        console.error(err);
      }

      setSuccessMessage("Pendaftaran akun berhasil! Mengarahkan ke dashboard...");
      setTimeout(() => {
        router.push("/pelanggan");
      }, 800);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Brand Header Non-Klik */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2.5 text-slate-900 mb-4 select-none">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="block text-base font-bold text-slate-900 leading-tight">
              Booking Teknisi Lokal
            </span>
            <span className="block text-xs text-blue-600 font-semibold">
              Portal Pelanggan
            </span>
          </div>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {activeTab === "login" ? "Masuk ke Akun Pelanggan" : "Pendaftaran Akun Baru"}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {activeTab === "login"
            ? "Pesan teknisi panggilan, lacak jadwal servis, dan pantau riwayat perbaikan."
            : "Daftar untuk menikmati kemudahan servis perangkat di rumah Anda."}
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-5 sm:px-8 rounded-xl border border-slate-200 shadow-xs">
          {/* Tabs */}
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
              Daftar Baru
            </button>
          </div>

          {/* Alert Error */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Alert Success */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Tab 1: Login */}
          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email atau Nomor WhatsApp Pelanggan
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="siti.rahma@gmail.com"
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
                    onClick={() => alert("Hubungi Customer Service untuk pemulihan kata sandi.")}
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
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Masuk...</span>
                    </>
                  ) : (
                    <span>Masuk ke Dashboard Pelanggan</span>
                  )}
                </button>
              </div>

              {/* Demo Helper */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-slate-50 -mx-5 -mb-6 px-5 py-3 rounded-b-xl">
                <div>
                  <p className="font-medium text-slate-800">Akun Pelanggan Contoh:</p>
                  <p className="text-[11px] text-slate-500">siti.rahma@gmail.com / pelanggan123</p>
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
            /* Tab 2: Register */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Siti Rahmawati"
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
                    placeholder="0812-3456-7890"
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
                    placeholder="siti@gmail.com"
                    className="w-full px-3 py-2 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Alamat Lengkap Kunjungan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <textarea
                    required
                    rows={2}
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Jl. Melati No. 14, Lowokwaru, Malang"
                    className="w-full pl-9 pr-3 py-2 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
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
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mendaftarkan Akun...</span>
                    </>
                  ) : (
                    <span>Daftar Akun Baru</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; 2025 Booking Teknisi Lokal. Portal Pengguna Pelanggan.
        </p>
      </div>
    </div>
  );
}
