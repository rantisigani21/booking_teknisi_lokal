"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Layers, AlertCircle } from "lucide-react";
import Modal from "@/components/admin/Modal";
import { initialCategories } from "@/lib/dummyData";

export default function KelolaKategoriJasaPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ nama: "", deskripsi: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      nama: cat.nama,
      deskripsi: cat.deskripsi,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) return;

    if (editingCategory) {
      // Edit existing
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, nama: formData.nama, deskripsi: formData.deskripsi }
            : c
        )
      );
    } else {
      // Add new
      const newCat = {
        id: `KAT-0${categories.length + 1}`,
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        jumlahLayanan: 0,
      };
      setCategories((prev) => [...prev, newCat]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kelola Kategori Jasa</h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftar pengelompokan spesialisasi teknisi dan bidang perbaikan lokal.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-28">ID</th>
                <th className="py-3 px-4 w-48">Nama Kategori</th>
                <th className="py-3 px-4">Deskripsi</th>
                <th className="py-3 px-4 w-32 text-center">Jumlah Layanan</th>
                <th className="py-3 px-4 w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-500">
                    {cat.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <span>{cat.nama}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                    {cat.deskripsi}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {cat.jumlahLayanan} Layanan
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(cat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Total {categories.length} kategori jasa aktif</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Kategori Jasa" : "Tambah Kategori Jasa Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Kategori <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Teknisi Komputer"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Deskripsi Kategori <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Deskripsi singkat jenis jasa dan perbaikan..."
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              {editingCategory ? "Simpan Perubahan" : "Tambah Kategori"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Konfirmasi Hapus Kategori"
        maxWidth="max-w-md"
      >
        {deleteConfirm && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Hapus kategori &quot;{deleteConfirm.nama}&quot;?</p>
                <p className="text-xs text-rose-700 mt-0.5">
                  Tindakan ini akan menghapus kategori jasa ini dari daftar opsi pemesanan teknisi.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
