"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Wrench,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  Power,
  RefreshCw,
  Clock,
  Mail,
  AlertTriangle,
} from "lucide-react";
import Modal from "@/components/admin/Modal";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastContext";
import { initialTechnicians } from "@/lib/dummyData";

export default function KelolaTeknisiPage() {
  const { showToast } = useToast();
  const [technicians, setTechnicians] = useState(initialTechnicians);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedTech, setSelectedTech] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTechnicians = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teknisi?include_all=true");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const formatted = json.data.map((t) => {
          const statusUser = t.status_user || "aktif";
          let displayStatus = "Aktif";
          if (statusUser === "menunggu_konfirmasi") {
            displayStatus = "Menunggu Konfirmasi";
          } else if (t.status_ketersediaan === "tersedia") {
            displayStatus = "Aktif";
          } else {
            displayStatus = "Tidak Aktif";
          }

          return {
            id: `TEK-${String(t.id).padStart(3, "0")}`,
            rawId: t.id,
            userId: t.user_id,
            nama: t.nama,
            email: t.email || "-",
            keahlian:
              t.layanan && t.layanan.length > 0
                ? t.layanan.map((l) => l.nama_layanan).slice(0, 2).join(", ")
                : t.deskripsi || "Teknisi Umum",
            noHp: t.no_hp || "-",
            lokasi: t.alamat || "Kota Makassar",
            status: displayStatus,
            statusUser: statusUser,
            statusKetersediaan: t.status_ketersediaan,
            jumlahSelesai: Number(t.jumlah_selesai || 0),
            rating: t.rating || 4.8,
            deskripsi: t.deskripsi,
            rawStatus: t.status_ketersediaan,
          };
        });
        setTechnicians(formatted);
      }
    } catch (err) {
      console.warn("Fallback to initial dummy technicians:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const getAuthHeaders = () => {
    const h = {
      "Content-Type": "application/json",
      "x-user-role": "admin",
      "x-user-id": "1",
    };
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("admin_auth") || "{}");
        if (stored.role) h["x-user-role"] = stored.role;
        if (stored.id) h["x-user-id"] = String(stored.id);
        if (stored.name) h["x-user-nama"] = stored.name;
      } catch {}
    }
    return h;
  };

  // Setujui teknisi yang menunggu konfirmasi
  const approveTechnician = async (techId) => {
    const targetTech = technicians.find((t) => t.id === techId);
    if (!targetTech) return;

    if (targetTech.rawId) {
      try {
        const res = await fetch(`/api/teknisi/${targetTech.rawId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            status_user: "aktif",
            status_ketersediaan: "tersedia",
            user_id: targetTech.userId,
          }),
        });
        const result = await res.json();

        if (result.success) {
          setTechnicians((prev) =>
            prev.map((t) =>
              t.id === techId
                ? {
                    ...t,
                    status: "Aktif",
                    statusUser: "aktif",
                    statusKetersediaan: "tersedia",
                  }
                : t
            )
          );
          if (selectedTech && selectedTech.id === techId) {
            setSelectedTech((prev) => ({
              ...prev,
              status: "Aktif",
              statusUser: "aktif",
              statusKetersediaan: "tersedia",
            }));
          }
          showToast(
            `Pendaftaran teknisi "${targetTech.nama}" telah disetujui. Akun sekarang aktif dan dapat login.`,
            "success",
            "Persetujuan Berhasil"
          );
        } else {
          showToast(result.message || "Gagal menyetujui akun teknisi", "error", "Gagal");
        }
      } catch (err) {
        console.error("Gagal menyetujui teknisi:", err);
        showToast("Terjadi gangguan koneksi saat menyetujui teknisi.", "error", "Gagal");
      }
    } else {
      setTechnicians((prev) =>
        prev.map((t) =>
          t.id === techId
            ? { ...t, status: "Aktif", statusUser: "aktif", statusKetersediaan: "tersedia" }
            : t
        )
      );
      showToast(
        `Teknisi "${targetTech.nama}" disetujui dan diaktifkan.`,
        "success",
        "Persetujuan Berhasil"
      );
    }
  };

  const toggleStatus = async (techId) => {
    const targetTech = technicians.find((t) => t.id === techId);
    if (!targetTech) return;

    // Jika sedang menunggu konfirmasi, tombol toggle mengaktifkan (menyetujui)
    if (targetTech.status === "Menunggu Konfirmasi") {
      return approveTechnician(techId);
    }

    const nextStatus = targetTech.status === "Aktif" ? "Tidak Aktif" : "Aktif";
    const nextAvailability = nextStatus === "Aktif" ? "tersedia" : "tidak_tersedia";

    setTechnicians((prev) =>
      prev.map((t) => (t.id === techId ? { ...t, status: nextStatus } : t))
    );
    if (selectedTech && selectedTech.id === techId) {
      setSelectedTech((prev) => ({
        ...prev,
        status: nextStatus,
      }));
    }

    if (targetTech.rawId) {
      try {
        await fetch(`/api/teknisi/${targetTech.rawId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status_ketersediaan: nextAvailability }),
        });

        showToast(
          `Status ketersediaan "${targetTech.nama}" diubah menjadi ${nextStatus}.`,
          "success",
          "Ketersediaan Teknisi Diperbarui"
        );
      } catch (err) {
        console.error("Gagal sinkronisasi status teknisi:", err);
        showToast("Gagal memperbarui status ke database.", "error", "Gagal Update");
      }
    } else {
      showToast(
        `Status teknisi "${targetTech?.nama || techId}" diubah menjadi ${nextStatus}.`,
        "info",
        "Ketersediaan Teknisi Diperbarui"
      );
    }
  };

  // Hitung jumlah menunggu konfirmasi
  const pendingCount = technicians.filter((t) => t.status === "Menunggu Konfirmasi").length;

  const filteredTechs = technicians.filter((t) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      t.nama.toLowerCase().includes(q) ||
      t.keahlian.toLowerCase().includes(q) ||
      t.lokasi.toLowerCase().includes(q);

    const matchStatus =
      statusFilter === "Semua" ? true : t.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Pending Approval Notice Banner */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Ada {pendingCount} Pendaftaran Teknisi Baru Menunggu Persetujuan
              </p>
              <p className="text-xs text-amber-700">
                Teknisi baru belum dapat masuk (login) ke sistem hingga akun diverifikasi & disetujui oleh Admin.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter("Menunggu Konfirmasi")}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shrink-0 shadow-xs"
          >
            Lihat Yang Menunggu ({pendingCount})
          </button>
        </div>
      )}

      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kelola Teknisi</h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftar mitra teknisi lokal, verifikasi pendaftaran baru, bidang jasa, dan status ketersediaan.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari teknisi, keahlian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={fetchTechnicians}
            disabled={isLoading}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
          </button>

          <div className="flex items-center gap-1.5 w-full sm:w-auto flex-wrap">
            {["Semua", "Menunggu Konfirmasi", "Aktif", "Tidak Aktif"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === st
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>{st}</span>
                {st === "Menunggu Konfirmasi" && pendingCount > 0 && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                      statusFilter === st
                        ? "bg-white text-blue-700"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Teknisi</th>
                <th className="py-3 px-4">Keahlian</th>
                <th className="py-3 px-4">Nomor HP</th>
                <th className="py-3 px-4">Lokasi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTechs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data teknisi yang cocok.
                  </td>
                </tr>
              ) : (
                filteredTechs.map((tech) => (
                  <tr
                    key={tech.id}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      tech.status === "Menunggu Konfirmasi" ? "bg-amber-50/30" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${
                            tech.status === "Menunggu Konfirmasi"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {tech.nama.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold">{tech.nama}</span>
                            {tech.status === "Menunggu Konfirmasi" && (
                              <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded">
                                BARU
                              </span>
                            )}
                          </div>
                          <span className="block text-[10px] text-slate-400 font-mono">
                            {tech.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {tech.keahlian}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{tech.noHp}</td>
                    <td className="py-3.5 px-4 text-slate-600">{tech.lokasi}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={tech.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {tech.status === "Menunggu Konfirmasi" ? (
                          <button
                            type="button"
                            onClick={() => approveTechnician(tech.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors shadow-2xs"
                            title="Setujui pendaftaran dan aktifkan teknisi ini"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Setujui</span>
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => setSelectedTech(tech)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>

                        {tech.status !== "Menunggu Konfirmasi" && (
                          <button
                            type="button"
                            onClick={() => toggleStatus(tech.id)}
                            title={
                              tech.status === "Aktif"
                                ? "Nonaktifkan Teknisi"
                                : "Aktifkan Teknisi"
                            }
                            className={`p-1 rounded-md border text-xs transition-colors ${
                              tech.status === "Aktif"
                                ? "text-slate-500 hover:text-rose-600 border-slate-200 hover:border-rose-200 hover:bg-rose-50"
                                : "text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan {filteredTechs.length} dari {technicians.length} teknisi
          </span>
          {pendingCount > 0 && (
            <span className="text-amber-700 font-medium">
              {pendingCount} teknisi butuh persetujuan
            </span>
          )}
        </div>
      </div>

      {/* Technician Detail Modal */}
      <Modal
        isOpen={!!selectedTech}
        onClose={() => setSelectedTech(null)}
        title="Detail Profil Teknisi"
      >
        {selectedTech && (
          <div className="space-y-4 text-xs sm:text-sm">
            {selectedTech.status === "Menunggu Konfirmasi" && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold">Menunggu Verifikasi & Persetujuan</p>
                  <p className="text-amber-700 mt-0.5">
                    Teknisi ini baru mendaftar. Silakan periksa keabsahan data sebelum menyetujui akun agar teknisi dapat masuk dan menerima pesanan layanan.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {selectedTech.nama.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-base">
                    {selectedTech.nama}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    ID: {selectedTech.id}
                  </p>
                </div>
              </div>
              <StatusBadge status={selectedTech.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Akun
                </p>
                <p className="font-medium text-slate-800">{selectedTech.email}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> Nomor Kontak (HP)
                </p>
                <p className="font-medium text-slate-800">{selectedTech.noHp}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-blue-600" /> Spesialisasi Keahlian
                </p>
                <p className="font-medium text-slate-800">{selectedTech.keahlian}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> Wilayah Operasional
                </p>
                <p className="font-medium text-slate-800">{selectedTech.lokasi}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 sm:col-span-2">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500" /> Performa Layanan
                </p>
                <p className="font-medium text-slate-800">
                  Rating {selectedTech.rating} / 5.0 ({selectedTech.jumlahSelesai} Order Selesai)
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              {selectedTech.status === "Menunggu Konfirmasi" ? (
                <button
                  type="button"
                  onClick={() => approveTechnician(selectedTech.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Setujui & Aktifkan Akun</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleStatus(selectedTech.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    selectedTech.status === "Aktif"
                      ? "text-rose-600 border-rose-200 hover:bg-rose-50"
                      : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  }`}
                >
                  {selectedTech.status === "Aktif"
                    ? "Ubah jadi Tidak Aktif"
                    : "Ubah jadi Aktif"}
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedTech(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
