"use client";

import { useState, useEffect } from "react";
import { Search, Eye, User, Mail, Phone, Calendar, MapPin, CheckCircle, RefreshCw } from "lucide-react";
import Modal from "@/components/admin/Modal";
import StatusBadge from "@/components/admin/StatusBadge";
import { initialUsers } from "@/lib/dummyData";

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/users");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const formatted = json.data.map((u) => ({
            id: `USR-${String(u.id).padStart(3, "0")}`,
            rawId: u.id,
            nama: u.nama,
            email: u.email,
            noHp: u.no_hp || "-",
            tanggalDaftar: u.created_at
              ? new Date(u.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Baru saja",
            alamat: "Kota Malang",
            totalBooking: u.total_booking || 0,
            status: u.status === "aktif" ? "Aktif" : "Tidak Aktif",
          }));
          setUsers(formatted);
        }
      } catch (err) {
        console.warn("Fallback to initial dummy users:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.nama.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.noHp && u.noHp.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kelola Pengguna</h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftar seluruh akun pelanggan lokal yang terdaftar dalam aplikasi.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, email, no HP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Pengguna</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Nomor HP</th>
                <th className="py-3 px-4">Tanggal Daftar</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data pengguna yang cocok.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs">
                          {user.nama.charAt(0)}
                        </div>
                        <span>{user.nama}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{user.email}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{user.noHp}</td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {user.tanggalDaftar}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(user)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredUsers.length} dari {users.length} pengguna</span>
        </div>
      </div>

      {/* User Detail Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Detail Akun Pengguna"
      >
        {selectedUser && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                {selectedUser.nama.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-base">{selectedUser.nama}</h4>
                <p className="text-xs text-slate-400 font-mono">ID: {selectedUser.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-500" /> Email
                </p>
                <p className="font-medium text-slate-800">{selectedUser.email}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" /> Nomor HP
                </p>
                <p className="font-medium text-slate-800">{selectedUser.noHp}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" /> Tanggal Registrasi
                </p>
                <p className="font-medium text-slate-800">{selectedUser.tanggalDaftar}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Riwayat Booking
                </p>
                <p className="font-medium text-slate-800">{selectedUser.totalBooking} Pemesanan Selesai</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" /> Alamat Lengkap
              </p>
              <p className="font-medium text-slate-800">{selectedUser.alamat}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
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
