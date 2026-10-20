"use client";

import { useState, useEffect } from "react";
import {
  Code2,
  Database,
  Send,
  Copy,
  Check,
  Server,
  Terminal,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Layers,
  Wrench,
  Users,
  CalendarCheck,
  BarChart3,
  KeyRound,
} from "lucide-react";

const ENDPOINTS = [
  {
    id: "root",
    category: "Sistem & Health",
    method: "GET",
    path: "/api",
    title: "Cek Status API & Database",
    description: "Memeriksa status koneksi API ke database MySQL booking_teknisi_lokal serta daftar endpoint.",
    defaultBody: null,
    sampleCurl: "curl -X GET http://localhost:3000/api",
  },
  {
    id: "stats",
    category: "Sistem & Health",
    method: "GET",
    path: "/api/stats",
    title: "Statistik Dashboard",
    description: "Mengambil rekap total pengguna, total teknisi, statistik booking, dan total omset dari MySQL.",
    defaultBody: null,
    sampleCurl: "curl -X GET http://localhost:3000/api/stats",
  },
  {
    id: "auth-login",
    category: "Autentikasi",
    method: "POST",
    path: "/api/auth/login",
    title: "Login Pengguna / Admin",
    description: "Autentikasi akun pengguna berdasarkan email dan password (mendukung role admin, teknisi, dan pelanggan).",
    defaultBody: JSON.stringify(
      {
        email: "admin@bookingteknisi.local",
        password: "password",
      },
      null,
      2
    ),
    sampleCurl: `curl -X POST http://localhost:3000/api/auth/login \\\n  -H "Content-Type: application/json" \\\n  -d '{"email":"admin@bookingteknisi.local","password":"password"}'`,
  },
  {
    id: "auth-register",
    category: "Autentikasi",
    method: "POST",
    path: "/api/auth/register",
    title: "Registrasi Pengguna Baru",
    description: "Mendaftarkan akun baru pelanggan atau teknisi ke tabel users.",
    defaultBody: JSON.stringify(
      {
        nama: "Pelanggan Baru",
        email: `pelanggan_${Date.now().toString().slice(-4)}@example.com`,
        password: "password123",
        no_hp: "081299887766",
        role: "pelanggan",
      },
      null,
      2
    ),
    sampleCurl: `curl -X POST http://localhost:3000/api/auth/register \\\n  -H "Content-Type: application/json" \\\n  -d '{"nama":"Pelanggan Baru","email":"pelanggan@example.com","password":"password123","no_hp":"081299887766","role":"pelanggan"}'`,
  },
  {
    id: "users-list",
    category: "Pengguna (Users)",
    method: "GET",
    path: "/api/users",
    title: "Daftar Seluruh Pengguna",
    description: "Mengambil daftar seluruh user dengan dukungan filter role, status, dan pencarian.",
    defaultBody: null,
    sampleCurl: "curl -X GET 'http://localhost:3000/api/users?role=pelanggan'",
  },
  {
    id: "users-detail",
    category: "Pengguna (Users)",
    method: "GET",
    path: "/api/users/2",
    title: "Detail Pengguna by ID",
    description: "Melihat profil lengkap pengguna beserta riwayat booking terbarunya.",
    defaultBody: null,
    sampleCurl: "curl -X GET http://localhost:3000/api/users/2",
  },
  {
    id: "kategori-list",
    category: "Kategori Jasa",
    method: "GET",
    path: "/api/kategori-jasa",
    title: "Daftar Kategori Jasa",
    description: "Mengambil seluruh kategori jasa beserta jumlah total layanan di setiap kategori.",
    defaultBody: null,
    sampleCurl: "curl -X GET http://localhost:3000/api/kategori-jasa",
  },
  {
    id: "kategori-create",
    category: "Kategori Jasa",
    method: "POST",
    path: "/api/kategori-jasa",
    title: "Tambah Kategori Jasa",
    description: "Menambahkan kategori jasa baru ke database.",
    defaultBody: JSON.stringify(
      {
        nama_kategori: "Kamera & CCTV",
        deskripsi: "Pemasangan dan perbaikan kamera CCTV dan DVR kantor/rumah.",
        status: "aktif",
      },
      null,
      2
    ),
    sampleCurl: `curl -X POST http://localhost:3000/api/kategori-jasa \\\n  -H "Content-Type: application/json" \\\n  -d '{"nama_kategori":"Kamera & CCTV","deskripsi":"Instalasi CCTV","status":"aktif"}'`,
  },
  {
    id: "layanan-list",
    category: "Layanan Jasa",
    method: "GET",
    path: "/api/layanan",
    title: "Daftar Seluruh Layanan",
    description: "Mengambil daftar layanan beserta relasi nama kategori dan harga.",
    defaultBody: null,
    sampleCurl: "curl -X GET http://localhost:3000/api/layanan",
  },
  {
    id: "layanan-create",
    category: "Layanan Jasa",
    method: "POST",
    path: "/api/layanan",
    title: "Tambah Layanan Baru",
    description: "Menambahkan paket jasa atau layanan servis baru.",
    defaultBody: JSON.stringify(
      {
        kategori_id: 1,
        nama_layanan: "Servis Engsel & Casing Laptop",
        deskripsi: "Perbaikan engsel laptop patah atau casing retak.",
        harga: 120000,
        status: "aktif",
      },
      null,
      2
    ),
    sampleCurl: `curl -X POST http://localhost:3000/api/layanan \\\n  -H "Content-Type: application/json" \\\n  -d '{"kategori_id":1,"nama_layanan":"Servis Engsel Laptop","harga":120000}'`,
  },
  {
    id: "teknisi-list",
    category: "Mitra Teknisi",
    method: "GET",
    path: "/api/teknisi",
    title: "Daftar Mitra Teknisi",
    description: "Mendapatkan data mitra teknisi lengkap dengan daftar keahlian jasa dan jumlah order terselesaikan.",
    defaultBody: null,
    sampleCurl: "curl -X GET http://localhost:3000/api/teknisi",
  },
  {
    id: "teknisi-detail",
    category: "Mitra Teknisi",
    method: "GET",
    path: "/api/teknisi/1",
    title: "Detail Teknisi by ID",
    description: "Mengambil detail profil teknisi, lokasi, spesialisasi layanan, dan riwayat tugasnya.",
    defaultBody: null,
    sampleCurl: "curl -X GET http://localhost:3000/api/teknisi/1",
  },
  {
    id: "booking-list",
    category: "Booking & Pemesanan",
    method: "GET",
    path: "/api/booking",
    title: "Daftar Seluruh Booking",
    description: "Melihat seluruh antrean pemesanan dengan join nama pelanggan, teknisi, dan layanan.",
    defaultBody: null,
    sampleCurl: "curl -X GET http://localhost:3000/api/booking",
  },
  {
    id: "booking-create",
    category: "Booking & Pemesanan",
    method: "POST",
    path: "/api/booking",
    title: "Buat Booking Baru",
    description: "Membuat tiket booking baru, otomatis generate kode BKG-xxx dan mencatat log riwayat awal.",
    defaultBody: JSON.stringify(
      {
        pelanggan_id: 2,
        layanan_id: 1,
        teknisi_id: 1,
        tanggal_booking: new Date().toISOString().slice(0, 10),
        waktu_booking: "10:00:00",
        alamat: "Jl. A.P. Pettarani No. 10, Makassar",
        keluhan: "Laptop tidak mau masuk Windows, perlu instal ulang segera.",
        total_harga: 150000,
      },
      null,
      2
    ),
    sampleCurl: `curl -X POST http://localhost:3000/api/booking \\\n  -H "Content-Type: application/json" \\\n  -d '{"pelanggan_id":2,"layanan_id":1,"tanggal_booking":"2026-10-20","waktu_booking":"10:00:00","alamat":"Makassar","keluhan":"Laptop error"}'`,
  },
  {
    id: "booking-update",
    category: "Booking & Pemesanan",
    method: "PUT",
    path: "/api/booking/1",
    title: "Update Status Booking",
    description: "Mengubah status (menunggu -> diterima -> diproses -> selesai) dan auto insert riwayat_status_booking.",
    defaultBody: JSON.stringify(
      {
        status: "diproses",
        catatan: "Teknisi sedang dalam perjalanan menuju lokasi pelanggan",
        diubah_oleh: 1,
      },
      null,
      2
    ),
    sampleCurl: `curl -X PUT http://localhost:3000/api/booking/1 \\\n  -H "Content-Type: application/json" \\\n  -d '{"status":"diproses","catatan":"Teknisi berangkat"}'`,
  },
];

export default function ApiDocumentationPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState(selectedEndpoint.defaultBody || "");
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);
  const [responseBody, setResponseBody] = useState(null);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: false, loading: true });

  // Update requestBody when selectedEndpoint changes
  useEffect(() => {
    setRequestBody(selectedEndpoint.defaultBody || "");
    setResponseStatus(null);
    setResponseBody(null);
  }, [selectedEndpoint]);

  // Initial DB check
  useEffect(() => {
    async function checkDb() {
      try {
        const res = await fetch("/api");
        const json = await res.json();
        if (json.success) {
          setDbStatus({
            connected: true,
            loading: false,
            database: json.data?.database?.databaseName,
            version: json.data?.database?.serverVersion,
          });
        } else {
          setDbStatus({ connected: false, loading: false });
        }
      } catch {
        setDbStatus({ connected: false, loading: false });
      }
    }
    checkDb();
  }, []);

  const handleExecute = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseBody(null);

    const startTime = performance.now();

    try {
      const options = {
        method: selectedEndpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (selectedEndpoint.method !== "GET" && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(selectedEndpoint.path, options);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);

      const json = await res.json();
      setResponseBody(JSON.stringify(json, null, 2));
    } catch (err) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(500);
      setResponseBody(
        JSON.stringify(
          {
            error: "Gagal terhubung ke API endpoint",
            details: err.message,
          },
          null,
          2
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "response") {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  // Group endpoints by category
  const categories = Array.from(new Set(ENDPOINTS.map((e) => e.category)));

  const getMethodBadgeClass = (method) => {
    switch (method) {
      case "GET":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "POST":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "PUT":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "DELETE":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & DB Info */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-indigo-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 backdrop-blur-xs">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  REST API & Dokumentasi Interaktif
                  <span className="text-[10px] uppercase font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                    v1.0.0
                  </span>
                </h1>
                <p className="text-xs text-slate-300 mt-0.5">
                  Endpoint lengkap untuk aplikasi Booking Teknisi Lokal terhubung langsung ke MySQL
                </p>
              </div>
            </div>
          </div>

          {/* Database Connection Pill */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-2.5 px-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    dbStatus.connected ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    dbStatus.connected ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
              </span>
              <div className="text-xs">
                <p className="font-semibold text-slate-200">
                  {dbStatus.loading
                    ? "Menghubungkan..."
                    : dbStatus.connected
                    ? "Database Terhubung"
                    : "MySQL Terputus"}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {dbStatus.connected ? `booking_teknisi_lokal (${dbStatus.version || "8.0"})` : "Cek Laragon/XAMPP"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 7 Tables quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 mt-5 pt-4 border-t border-white/10 text-xs">
          {[
            { name: "users", label: "Pengguna", count: "4+" },
            { name: "teknisi", label: "Teknisi", count: "2+" },
            { name: "kategori_jasa", label: "Kategori", count: "4" },
            { name: "layanan", label: "Layanan", count: "6" },
            { name: "teknisi_layanan", label: "Keahlian", count: "6" },
            { name: "booking", label: "Booking", count: "2+" },
            { name: "riwayat_status", label: "Log Status", count: "3+" },
          ].map((tbl) => (
            <div key={tbl.name} className="bg-white/5 rounded-md p-2 border border-white/5">
              <div className="text-[10px] text-slate-400 font-mono truncate">{tbl.name}</div>
              <div className="font-semibold text-slate-200 text-xs mt-0.5">{tbl.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Column Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Endpoints Directory */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Daftar Endpoint API</span>
              <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {ENDPOINTS.length} rute
              </span>
            </h2>

            <div className="space-y-4 max-h-[720px] overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div key={cat} className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                    {cat}
                  </div>
                  <div className="space-y-1">
                    {ENDPOINTS.filter((e) => e.category === cat).map((ep) => {
                      const isSelected = selectedEndpoint.id === ep.id;
                      return (
                        <button
                          key={ep.id}
                          type="button"
                          onClick={() => setSelectedEndpoint(ep)}
                          className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between group ${
                            isSelected
                              ? "bg-blue-50 border border-blue-200 text-blue-900 shadow-xs"
                              : "hover:bg-slate-50 border border-transparent text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${getMethodBadgeClass(
                                ep.method
                              )}`}
                            >
                              {ep.method}
                            </span>
                            <span className="font-medium truncate">{ep.title}</span>
                          </div>
                          <ChevronRight
                            className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                              isSelected ? "text-blue-600 translate-x-0.5" : "text-slate-400 opacity-0 group-hover:opacity-100"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Tester & Response Console */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Endpoint Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header / URL Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-xs font-mono font-bold px-2 py-1 rounded-md border uppercase ${getMethodBadgeClass(
                    selectedEndpoint.method
                  )}`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-sm font-semibold text-slate-800">
                  {selectedEndpoint.path}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(selectedEndpoint.sampleCurl, "curl")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  title="Salin cURL command"
                >
                  {copiedCurl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin cURL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleExecute}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 rounded-lg shadow-xs transition-colors"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedEndpoint.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedEndpoint.description}</p>
              </div>

              {/* Request Payload Editor (for POST/PUT) */}
              {selectedEndpoint.method !== "GET" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Request Body (JSON):</span>
                    <button
                      type="button"
                      onClick={() => setRequestBody(selectedEndpoint.defaultBody || "")}
                      className="text-blue-600 hover:underline text-[11px]"
                    >
                      Reset Default JSON
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-lg border border-slate-700 focus:outline-hidden focus:border-blue-500"
                    placeholder="Masukkan JSON request..."
                  />
                </div>
              )}

              {/* Response Panel */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-700">Response Server:</span>
                    {responseStatus !== null && (
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                          responseStatus >= 200 && responseStatus < 300
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {responseStatus} {responseStatus === 200 ? "OK" : responseStatus === 201 ? "CREATED" : ""}
                      </span>
                    )}
                    {responseTime !== null && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {responseTime} ms
                      </span>
                    )}
                  </div>

                  {responseBody && (
                    <button
                      type="button"
                      onClick={() => handleCopy(responseBody, "response")}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
                    >
                      {copiedResponse ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin JSON</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Response Code Output Box */}
                <div className="relative rounded-lg bg-slate-900 border border-slate-800 p-4 min-h-[220px] max-h-[360px] overflow-auto">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                      <span className="text-xs">Mengeksekusi query database...</span>
                    </div>
                  ) : responseBody ? (
                    <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {responseBody}
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-500 space-y-2">
                      <Terminal className="w-8 h-8 opacity-40" />
                      <p className="text-xs">Klik tombol &quot;Kirim Request&quot; di atas untuk menguji API ini secara langsung.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Database Schema Reference Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Referensi Skema Database MySQL: booking_teknisi_lokal</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Setiap endpoint terintegrasi langsung dengan 7 tabel database relational MySQL di localhost (Laragon/XAMPP).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70">
                <span className="font-mono font-semibold text-blue-600">users</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Menyimpan akun login admin, teknisi, dan pelanggan dengan password terenkripsi bcrypt.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70">
                <span className="font-mono font-semibold text-blue-600">booking</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Menyimpan tiket pemesanan servis, relasi pelanggan & teknisi, tanggal, alamat, dan total biaya.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70">
                <span className="font-mono font-semibold text-blue-600">riwayat_status_booking</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Audit log perubahan status dari menunggu, diterima, diproses, hingga selesai/dibatalkan.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70">
                <span className="font-mono font-semibold text-blue-600">teknisi & teknisi_layanan</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Profil keahlian teknisi, koordinat lokasi, status ketersediaan, dan mapping layanan yang dikerjakan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
