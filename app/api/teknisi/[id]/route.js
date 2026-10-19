import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";


// GET /api/teknisi/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const techs = await query(
      `SELECT 
        t.id, 
        t.user_id, 
        u.nama, 
        u.email, 
        u.no_hp, 
        u.foto, 
        u.status AS status_user, 
        t.deskripsi, 
        t.alamat, 
        t.latitude, 
        t.longitude, 
        t.status_ketersediaan, 
        t.created_at, 
        t.updated_at,
        COUNT(CASE WHEN b.status = 'selesai' THEN 1 END) AS jumlah_selesai,
        COUNT(b.id) AS total_order
      FROM teknisi t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN booking b ON t.id = b.teknisi_id
      WHERE t.id = ? OR t.user_id = ?
      GROUP BY t.id 
      LIMIT 1`,
      [id, id]
    );

    if (techs.length === 0) {
      return errorResponse("Teknisi tidak ditemukan", 404);
    }

    const tech = techs[0];

    // Ambil daftar layanan yang didukung
    const services = await query(
      `SELECT 
        tl.layanan_id, 
        l.nama_layanan, 
        k.nama_kategori, 
        COALESCE(tl.harga, l.harga) AS harga,
        l.deskripsi
       FROM teknisi_layanan tl
       JOIN layanan l ON tl.layanan_id = l.id
       JOIN kategori_jasa k ON l.kategori_id = k.id
       WHERE tl.teknisi_id = ?`,
      [tech.id]
    );

    // Ambil order booking terbaru
    const recentBookings = await query(
      `SELECT 
        b.id, 
        b.kode_booking, 
        b.tanggal_booking, 
        b.waktu_booking, 
        b.status, 
        b.total_harga, 
        u.nama AS pelanggan_nama
       FROM booking b
       JOIN users u ON b.pelanggan_id = u.id
       WHERE b.teknisi_id = ?
       ORDER BY b.created_at DESC
       LIMIT 5`,
      [tech.id]
    );

    return successResponse(
      {
        ...tech,
        rating: 4.8,
        layanan: services,
        recent_bookings: recentBookings,
      },
      "Data detail teknisi ditemukan"
    );
  } catch (error) {
    console.error("GET teknisi [id] error:", error);
    return errorResponse("Gagal mengambil detail teknisi", 500, error);
  }
}

// PUT /api/teknisi/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      deskripsi,
      alamat,
      latitude,
      longitude,
      status_ketersediaan,
      layanan_ids,
    } = body;

    const existing = await query("SELECT * FROM teknisi WHERE id = ? OR user_id = ? LIMIT 1", [
      id,
      id,
    ]);
    if (existing.length === 0) {
      return errorResponse("Teknisi tidak ditemukan", 404);
    }

    const current = existing[0];
    const techId = current.id;

    await query(
      `UPDATE teknisi 
       SET deskripsi = ?, alamat = ?, latitude = ?, longitude = ?, status_ketersediaan = ? 
       WHERE id = ?`,
      [
        deskripsi !== undefined ? deskripsi : current.deskripsi,
        alamat !== undefined ? alamat : current.alamat,
        latitude !== undefined ? latitude : current.latitude,
        longitude !== undefined ? longitude : current.longitude,
        status_ketersediaan !== undefined ? status_ketersediaan : current.status_ketersediaan,
        techId,
      ]
    );

    // Sinkronisasi layanan jika disediakan
    if (Array.isArray(layanan_ids)) {
      await query("DELETE FROM teknisi_layanan WHERE teknisi_id = ?", [techId]);
      for (const layId of layanan_ids) {
        await query(
          "INSERT IGNORE INTO teknisi_layanan (teknisi_id, layanan_id) VALUES (?, ?)",
          [techId, layId]
        );
      }
    }

    const [updated] = await query("SELECT * FROM teknisi WHERE id = ?", [techId]);
    return successResponse(updated, "Profil teknisi berhasil diperbarui");
  } catch (error) {
    console.error("PUT teknisi [id] error:", error);
    return errorResponse("Gagal memperbarui data teknisi", 500, error);
  }
}

// DELETE /api/teknisi/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const existing = await query("SELECT id FROM teknisi WHERE id = ? OR user_id = ? LIMIT 1", [
      id,
      id,
    ]);
    if (existing.length === 0) {
      return errorResponse("Teknisi tidak ditemukan", 404);
    }

    const techId = existing[0].id;

    // Hapus relasi di teknisi_layanan
    await query("DELETE FROM teknisi_layanan WHERE teknisi_id = ?", [techId]);
    await query("DELETE FROM teknisi WHERE id = ?", [techId]);

    return successResponse({ id: techId }, "Profil teknisi berhasil dihapus");
  } catch (error) {
    console.error("DELETE teknisi [id] error:", error);
    return errorResponse("Gagal menghapus data teknisi", 500, error);
  }
}
