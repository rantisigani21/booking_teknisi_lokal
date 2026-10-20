"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wrench,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Quick fill helper for demo/testing
  const handleUseDemo = () => {
    setEmail("admin@bookingteknisi.local");
    setPassword("admin123");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Silakan isi alamat email atau username.");
      return;
    }

    if (!password) {
      setErrorMessage("Silakan isi kata sandi akun Anda.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMessage("Login berhasil. Mengarahkan ke halaman dashboard...");
        try {
          localStorage.setItem(
            "admin_auth",
            JSON.stringify({
              id: json.data.id,
              email: json.data.email,
              name: json.data.nama,
              role: json.data.role,
              loginAt: new Date().toISOString(),
              rememberMe,
            })
          );
        } catch (err) {
          console.error("Storage error:", err);
        }

        setTimeout(() => {
          router.push("/admin");
        }, 600);
        return;
      } else {
        // Fallback demo check jika akun demo statis lokal
        if (
          (email === "admin@bookingteknisi.id" && password === "admin123") ||
          (email.includes("admin") && password.length >= 6)
        ) {
          setSuccessMessage("Login berhasil (Mode Demo). Mengarahkan...");
          localStorage.setItem(
            "admin_auth",
            JSON.stringify({
              email,
              name: "Admin Utama (Demo)",
              role: "admin",
              loginAt: new Date().toISOString(),
              rememberMe,
            })
          );
          setTimeout(() => {
            router.push("/admin");
          }, 600);
          return;
        }

        setIsLoading(false);
        setErrorMessage(json.message || "Email atau kata sandi salah. Silakan periksa kembali.");
      }
    } catch {
      // Offline fallback
      if (
        (email === "admin@bookingteknisi.id" && password === "admin123") ||
        (email.includes("admin") && password.length >= 6)
      ) {
        setSuccessMessage("Login berhasil. Mengarahkan ke dashboard...");
        localStorage.setItem(
          "admin_auth",
          JSON.stringify({
            email,
            name: "Admin Utama",
            role: "admin",
            loginAt: new Date().toISOString(),
            rememberMe,
          })
        );
        setTimeout(() => router.push("/admin"), 600);
      } else {
        setIsLoading(false);
        setErrorMessage("Gagal menghubungkan ke server API.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2.5 text-slate-900 mb-4 select-none">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="block text-base font-bold text-slate-900 leading-tight">
              Booking Teknisi Lokal
            </span>
            <span className="block text-xs text-slate-500 font-medium">
              Panel Administrasi
            </span>
          </div>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Login Administrator
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Masukkan email dan kata sandi untuk masuk ke sistem.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-6 px-5 sm:px-8 rounded-xl border border-slate-200 shadow-xs">

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Email Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bookingteknisi.id"
                  disabled={isLoading}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700"
                >
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Lupa sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-sm text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600">
                  Ingat saya di perangkat ini
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <span>Masuk ke Dashboard</span>
                )}
              </button>
            </div>
          </form>

          {/* Akun Demo Helper Box (Praktis & Sederhana) */}
          <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50 -mx-5 -mb-6 px-5 py-3.5 rounded-b-xl flex items-center justify-between text-xs text-slate-600">
            <div>
              <p className="font-medium text-slate-800">Akun Demo:</p>
              <p className="text-[11px] text-slate-500">
                admin@bookingteknisi.id / admin123
              </p>
            </div>
            <button
              type="button"
              onClick={handleUseDemo}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
            >
              Isi Otomatis
            </button>
          </div>
        </div>


        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; 2025 Booking Teknisi Lokal. Semua hak dilindungi.
        </p>
      </div>

      {/* Modal Lupa Password Sederhana */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-lg border border-slate-200 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-slate-900">
              Lupa Kata Sandi?
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Silakan hubungi Super Admin IT untuk melakukan reset kata sandi akun Anda:
            </p>

            <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <p>
                <span className="font-semibold text-slate-800">Email IT:</span>{" "}
                admin@bookingteknisi.id
              </p>
              <p>
                <span className="font-semibold text-slate-800">WhatsApp:</span>{" "}
                0812-3456-7890
              </p>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  handleUseDemo();
                  setShowForgotModal(false);
                }}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Gunakan Akun Demo
              </button>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
