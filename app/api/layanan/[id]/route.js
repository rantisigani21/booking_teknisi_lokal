import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";


// GET /api/layanan/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const services = await query(
      `SELECT 
        l.id, 
        l.kategori_id, 
        k.nama_kategori, 
        l.nama_layanan, 
        l.deskripsi, 
        CAST(l.harga AS DOUBLE) AS harga, 
        l.status, 
        l.created_at, 
        l.updated_at
      FROM layanan l
      JOIN kategori_jasa k ON l.kategori_id = k.id
      WHERE l.id = ? 
      LIMIT 1`,
      [id]
    );

    if (services.length === 0) {
      return errorResponse("Layanan tidak ditemukan", 404);
    }

    return successResponse(services[0], "Data layanan ditemukan");
  } catch (error) {
    console.error("GET layanan [id] error:", error);
    return errorResponse("Gagal mengambil detail layanan", 500, error);
  }
}

// PUT /api/layanan/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { kategori_id, nama_layanan, deskripsi, harga, status } = body;

    const existing = await query("SELECT * FROM layanan WHERE id = ? LIMIT 1", [id]);
    if (existing.length === 0) {
      return errorResponse("Layanan tidak ditemukan", 404);
    }

    const current = existing[0];

    // Jika ganti kategori, pastikan ada
    if (kategori_id && kategori_id !== current.kategori_id) {
      const catCheck = await query("SELECT id FROM kategori_jasa WHERE id = ? LIMIT 1", [kategori_id]);
      if (catCheck.length === 0) {
        return errorResponse("Kategori tidak valid", 400);
      }
    }

    const updatedHarga = harga !== undefined ? Number(harga) : current.harga;

    await query(
      `UPDATE layanan 
       SET kategori_id = ?, nama_layanan = ?, deskripsi = ?, harga = ?, status = ? 
       WHERE id = ?`,
      [
        kategori_id !== undefined ? kategori_id : current.kategori_id,
        nama_layanan !== undefined ? nama_layanan.trim() : current.nama_layanan,
        deskripsi !== undefined ? deskripsi : current.deskripsi,
        updatedHarga,
        status !== undefined ? status : current.status,
        id,
      ]
    );

    const [updated] = await query(
      `SELECT l.*, k.nama_kategori 
       FROM layanan l 
       JOIN kategori_jasa k ON l.kategori_id = k.id 
       WHERE l.id = ?`,
      [id]
    );

    return successResponse(updated, "Layanan berhasil diperbarui");
  } catch (error) {
    console.error("PUT layanan [id] error:", error);
    return errorResponse("Gagal memperbarui layanan", 500, error);
  }
}

// DELETE /api/layanan/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const existing = await query("SELECT id FROM layanan WHERE id = ? LIMIT 1", [id]);
    if (existing.length === 0) {
      return errorResponse("Layanan tidak ditemukan", 404);
    }

    // Cek apakah ada booking yang menggunakan layanan ini
    const bookings = await query("SELECT id FROM booking WHERE layanan_id = ? LIMIT 1", [id]);
    if (bookings.length > 0) {
      // Jika sudah ada booking, ubah status menjadi tidak_aktif
      await query("UPDATE layanan SET status = 'tidak_aktif' WHERE id = ?", [id]);
      return successResponse(
        { id, status: "tidak_aktif" },
        "Layanan memiliki relasi pemesanan, status diubah menjadi tidak aktif"
      );
    }

    // Hapus juga di teknisi_layanan
    await query("DELETE FROM teknisi_layanan WHERE layanan_id = ?", [id]);
    await query("DELETE FROM layanan WHERE id = ?", [id]);

    return successResponse({ id }, "Layanan berhasil dihapus");
  } catch (error) {
    console.error("DELETE layanan [id] error:", error);
    return errorResponse("Gagal menghapus layanan", 500, error);
  }
}
