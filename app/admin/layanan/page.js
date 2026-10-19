"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, AlertCircle, Tag, RefreshCw } from "lucide-react";
import Modal from "@/components/admin/Modal";
import { useToast } from "@/components/admin/ToastContext";
import { initialServices, initialCategories } from "@/lib/dummyData";

export default function KelolaLayananPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState(initialServices);
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nama: "",
    kategori: initialCategories[0]?.nama || "Teknisi Komputer",
    deskripsi: "",
    harga: "",
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resSrv, resCat] = await Promise.all([
        fetch("/api/layanan"),
        fetch("/api/kategori-jasa"),
      ]);
      const jsonSrv = await resSrv.json();
      const jsonCat = await resCat.json();

      if (jsonCat.success && Array.isArray(jsonCat.data) && jsonCat.data.length > 0) {
        setCategories(
          jsonCat.data.map((c) => ({
            id: `KAT-${String(c.id).padStart(2, "0")}`,
            rawId: c.id,
            nama: c.nama_kategori,
          }))
        );
      }

      if (jsonSrv.success && Array.isArray(jsonSrv.data) && jsonSrv.data.length > 0) {
        setServices(
          jsonSrv.data.map((s) => ({
            id: `SRV-${String(s.id).padStart(3, "0")}`,
            rawId: s.id,
            kategoriId: s.kategori_id,
            nama: s.nama_layanan,
            kategori: s.nama_kategori,
            deskripsi: s.deskripsi || "-",
            harga: Number(s.harga || 0),
          }))
        );
      }
    } catch (err) {
      console.warn("Fallback to initial dummy services:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      nama: "",
      kategori: categories[0]?.nama || "Teknisi Komputer",
      deskripsi: "",
      harga: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (srv) => {
    setEditingService(srv);
    setFormData({
      nama: srv.nama,
      kategori: srv.kategori,
      deskripsi: srv.deskripsi,
      harga: srv.harga.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) return;

    const numericPrice = parseInt(formData.harga.replace(/[^0-9]/g, ""), 10) || 0;

    // Cari kategori_id
    const matchedCategory = categories.find((c) => c.nama === formData.kategori);
    const catId = matchedCategory?.rawId || 1;

    try {
      if (editingService) {
        const targetId = editingService.rawId || editingService.id;
        const res = await fetch(`/api/layanan/${targetId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kategori_id: catId,
            nama_layanan: formData.nama.trim(),
            deskripsi: formData.deskripsi,
            harga: numericPrice,
          }),
        });

        if (!res.ok) {
          const json = await res.json();
          showToast(json.message || "Gagal memperbarui layanan.", "error", "Gagal Update");
          return;
        }

        setServices((prev) =>
          prev.map((s) =>
            s.id === editingService.id
              ? {
                  ...s,
                  nama: formData.nama,
                  kategori: formData.kategori,
                  deskripsi: formData.deskripsi,
                  harga: numericPrice,
                }
              : s
          )
        );

        showToast(
          `Layanan "${formData.nama}" berhasil diperbarui.`,
          "success",
          "Layanan Diperbarui"
        );
      } else {
        const res = await fetch("/api/layanan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kategori_id: catId,
            nama_layanan: formData.nama.trim(),
            deskripsi: formData.deskripsi,
            harga: numericPrice,
            status: "aktif",
          }),
        });
        const json = await res.json();

        if (!res.ok) {
          showToast(json.message || "Gagal menambahkan layanan.", "error", "Gagal Menambahkan");
          return;
        }

        const createdId = json.data?.id || services.length + 1;

        const newSrv = {
          id: `SRV-${String(createdId).padStart(3, "0")}`,
          rawId: createdId,
          kategoriId: catId,
          nama: formData.nama,
          kategori: formData.kategori,
          deskripsi: formData.deskripsi,
          harga: numericPrice,
        };
        setServices((prev) => [...prev, newSrv]);

        showToast(
          `Layanan baru "${formData.nama}" berhasil ditambahkan!`,
          "success",
          "Layanan Ditambahkan"
        );
      }
      setIsModalOpen(false);
    } catch {
      showToast("Terjadi kendala saat menyimpan layanan.", "error", "Gagal Menyimpan");
      setIsModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      const deletedName = deleteConfirm.nama;
      try {
        const targetId = deleteConfirm.rawId || deleteConfirm.id;
        const res = await fetch(`/api/layanan/${targetId}`, { method: "DELETE" });
        const json = await res.json();

        if (!res.ok) {
          showToast(json.message || "Layanan tidak dapat dihapus.", "error", "Gagal Menghapus");
          return;
        }

        setServices((prev) => prev.filter((s) => s.id !== deleteConfirm.id));
        setDeleteConfirm(null);

        showToast(
          `Layanan "${deletedName}" berhasil dihapus dari sistem.`,
          "success",
          "Layanan Dihapus"
        );
      } catch {
        setServices((prev) => prev.filter((s) => s.id !== deleteConfirm.id));
        setDeleteConfirm(null);
        showToast(
          `Layanan "${deletedName}" telah dihapus.`,
          "info",
          "Layanan Dihapus"
        );
      }
    }
  };

  const filteredServices = services.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      s.nama.toLowerCase().includes(q) ||
      s.deskripsi.toLowerCase().includes(q);
    const matchCat =
      selectedCategory === "Semua" ? true : s.kategori === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kelola Layanan</h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftar paket jasa teknisi, deskripsi pengerjaan, dan estimasi biaya standar.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Filters: Category and Search */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama layanan, deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          />
        </div>

        <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 whitespace-nowrap">Kategori:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-700 font-medium"
          >
            <option value="Semua">Semua Kategori</option>
            {initialCategories.map((c) => (
              <option key={c.id} value={c.nama}>
                {c.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Layanan</th>
                <th className="py-3 px-4">Kategori Jasa</th>
                <th className="py-3 px-4">Deskripsi</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada layanan yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredServices.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>
                        <span>{srv.nama}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {srv.id}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <Tag className="w-3 h-3 text-blue-500" />
                        {srv.kategori}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-sm">
                      {srv.deskripsi}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      Rp {srv.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(srv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(srv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredServices.length} dari {services.length} layanan</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Layanan Jasa" : "Tambah Layanan Jasa Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Layanan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ganti Thermal Paste Laptop"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kategori Jasa <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              {initialCategories.map((c) => (
                <option key={c.id} value={c.nama}>
                  {c.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Deskripsi Pekerjaan <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Rincian perbaikan dan komponen yang ditangani..."
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Harga Standar (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="5000"
              placeholder="Contoh: 150000"
              value={formData.harga}
              onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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
              {editingService ? "Simpan Perubahan" : "Tambah Layanan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Konfirmasi Hapus Layanan"
        maxWidth="max-w-md"
      >
        {deleteConfirm && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Hapus layanan &quot;{deleteConfirm.nama}&quot;?</p>
                <p className="text-xs text-rose-700 mt-0.5">
                  Layanan ini tidak akan dapat dipilih lagi oleh pelanggan dalam pesanan baru.
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
