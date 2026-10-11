"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Wrench, CalendarCheck, Clock, ArrowRight, Eye, Calendar, MapPin, Phone, User, Tag } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import Modal from "@/components/admin/Modal";
import { initialStats, initialBookings } from "@/lib/dummyData";

export default function DashboardPage() {
  // Use first 5 dummy bookings for "Booking Terbaru"
  const recentBookings = initialBookings.slice(0, 5);
  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">
          Selamat Datang, Admin
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Kelola pengguna, teknisi, layanan, dan pemesanan melalui dashboard Booking Teknisi Lokal.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pengguna"
          value={initialStats.totalPengguna}
          icon={Users}
          subtitle="Pelanggan terdaftar"
        />
        <StatCard
          title="Total Teknisi"
          value={initialStats.totalTeknisi}
          icon={Wrench}
          subtitle="Mitra teknisi aktif"
        />
        <StatCard
          title="Total Booking"
          value={initialStats.totalBooking}
          icon={CalendarCheck}
          subtitle="Semua pesanan"
        />
        <StatCard
          title="Booking Menunggu"
          value={initialStats.bookingMenunggu}
          icon={Clock}
          subtitle="Perlu konfirmasi"
        />
      </div>

      {/* Tabel Booking Terbaru */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Booking Terbaru
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              5 transaksi pemesanan teknisi terakhir
            </p>
          </div>
          <Link
            href="/admin/booking"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors w-fit"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">ID Booking</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Teknisi</th>
                <th className="py-3 px-4">Layanan</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                    {b.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {b.pelanggan}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Booking */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Informasi Pelanggan
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

              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
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

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-medium text-slate-500">Layanan yang Dipesan</label>
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{selectedBooking.layanan}</p>
                  <p className="text-xs text-slate-500">{selectedBooking.kategori}</p>
                </div>
                <span className="font-semibold text-blue-600 text-sm">{selectedBooking.biaya}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Keluhan / Catatan Pelanggan</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs">
                {selectedBooking.keluhan || "Tidak ada catatan tambahan."}
              </div>
            </div>

            <div className="pt-3 flex justify-end">
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
