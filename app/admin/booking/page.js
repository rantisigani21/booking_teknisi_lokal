"use client";

import { useState } from "react";
import { Search, Eye, Filter, Calendar, MapPin, Phone, User, Wrench, Tag, Check, RefreshCw } from "lucide-react";
import Modal from "@/components/admin/Modal";
import StatusBadge from "@/components/admin/StatusBadge";
import { initialBookings } from "@/lib/dummyData";

export default function KelolaBookingPage() {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const updateBookingStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      b.id.toLowerCase().includes(q) ||
      b.pelanggan.toLowerCase().includes(q) ||
      b.teknisi.toLowerCase().includes(q) ||
      b.layanan.toLowerCase().includes(q);

    const matchStatus =
      statusFilter === "Semua" ? true : b.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kelola Booking</h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau dan kelola seluruh jadwal pemesanan servis teknisi lokal yang masuk.
          </p>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID Booking, Pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["Semua", "Menunggu", "Diproses", "Selesai", "Dibatalkan"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${statusFilter === st
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {st}
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
                <th className="py-3 px-4">ID Booking</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Teknisi</th>
                <th className="py-3 px-4">Layanan</th>
                <th className="py-3 px-4">Tanggal Booking</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data booking yang cocok.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      {b.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {b.pelanggan}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {b.teknisi}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                      {b.layanan}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {b.tanggal}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(b)}
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

        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredBookings.length} dari {bookings.length} total pesanan</span>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Detail Pemesanan Teknisi"
      >
        {selectedBooking && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400">ID Booking</span>
                <p className="font-mono font-semibold text-slate-900 text-base">
                  {selectedBooking.id}
                </p>
              </div>
              <StatusBadge status={selectedBooking.status} />
            </div>

            {/* Quick Status Updater */}
            <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-100">
              <label className="text-xs font-medium text-blue-900 block mb-1.5">
                Ubah Status Pemesanan:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["Menunggu", "Diproses", "Selesai", "Dibatalkan"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateBookingStatus(selectedBooking.id, st)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${selectedBooking.status === st
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Pelanggan
                </p>
                <div>
                  <p className="font-medium text-slate-800">{selectedBooking.pelanggan}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {selectedBooking.pelangganHp}
                  </p>
                  <p className="text-xs text-slate-500 flex items-start gap-1 mt-1">
                    <MapPin className="w-3 h-3 shrink-0 mt-0.5" /> {selectedBooking.alamat}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-blue-600" /> Teknisi Bertugas
                </p>
                <div>
                  <p className="font-medium text-slate-800">{selectedBooking.teknisi}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Tag className="w-3 h-3" /> {selectedBooking.kategori}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> {selectedBooking.tanggal} ({selectedBooking.jam})
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Layanan & Biaya</label>
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{selectedBooking.layanan}</p>
                  <p className="text-xs text-slate-500">{selectedBooking.kategori}</p>
                </div>
                <span className="font-semibold text-blue-600 text-sm">{selectedBooking.biaya}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Keluhan / Catatan</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs leading-relaxed">
                {selectedBooking.keluhan || "Tidak ada keluhan khusus."}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
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
