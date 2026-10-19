import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";


// GET /api/kategori-jasa/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const categories = await query(
      `SELECT 
        k.*, 
        COUNT(l.id) AS jumlah_layanan 
       FROM kategori_jasa k
       LEFT JOIN layanan l ON k.id = l.kategori_id
       WHERE k.id = ? 
       GROUP BY k.id 
       LIMIT 1`,
      [id]
    );

    if (categories.length === 0) {
      return errorResponse("Kategori tidak ditemukan", 404);
    }

    // Ambil daftar layanan terkait kategori ini
    const services = await query("SELECT * FROM layanan WHERE kategori_id = ?", [id]);

    return successResponse(
      {
        ...categories[0],
        layanan: services,
      },
      "Data kategori ditemukan"
    );
  } catch (error) {
    console.error("GET kategori-jasa [id] error:", error);
    return errorResponse("Gagal mengambil detail kategori", 500, error);
  }
}

// PUT /api/kategori-jasa/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nama_kategori, deskripsi, status } = body;

    const existing = await query("SELECT * FROM kategori_jasa WHERE id = ? LIMIT 1", [id]);
    if (existing.length === 0) {
      return errorResponse("Kategori tidak ditemukan", 404);
    }

    const current = existing[0];

    await query(
      `UPDATE kategori_jasa 
       SET nama_kategori = ?, deskripsi = ?, status = ? 
       WHERE id = ?`,
      [
        nama_kategori !== undefined ? nama_kategori.trim() : current.nama_kategori,
        deskripsi !== undefined ? deskripsi : current.deskripsi,
        status !== undefined ? status : current.status,
        id,
      ]
    );

    const [updated] = await query("SELECT * FROM kategori_jasa WHERE id = ?", [id]);
    return successResponse(updated, "Kategori berhasil diperbarui");
  } catch (error) {
    console.error("PUT kategori-jasa [id] error:", error);
    return errorResponse("Gagal memperbarui kategori", 500, error);
  }
}

// DELETE /api/kategori-jasa/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const existing = await query("SELECT * FROM kategori_jasa WHERE id = ? LIMIT 1", [id]);
    if (existing.length === 0) {
      return errorResponse("Kategori tidak ditemukan", 404);
    }

    // Cek apakah ada layanan yang memakai kategori ini
    const connectedServices = await query(
      "SELECT id FROM layanan WHERE kategori_id = ? LIMIT 1",
      [id]
    );

    if (connectedServices.length > 0) {
      return errorResponse(
        "Kategori tidak dapat dihapus karena masih memiliki layanan terkait. Ubah status kategori menjadi 'tidak_aktif' atau pindahkan layanannya terlebih dahulu.",
        400
      );
    }

    await query("DELETE FROM kategori_jasa WHERE id = ?", [id]);
    return successResponse({ id }, "Kategori berhasil dihapus");
  } catch (error) {
    console.error("DELETE kategori-jasa [id] error:", error);
    return errorResponse("Gagal menghapus kategori", 500, error);
  }
}
