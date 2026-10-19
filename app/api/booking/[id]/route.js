import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";


// GET /api/booking/[id] (menerima id numerik atau kode_booking)
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const bookings = await query(
      `SELECT 
        b.id,
        b.kode_booking,
        b.pelanggan_id,
        u_pelanggan.nama AS pelanggan_nama,
        u_pelanggan.no_hp AS pelanggan_no_hp,
        u_pelanggan.email AS pelanggan_email,
        b.teknisi_id,
        u_teknisi.nama AS teknisi_nama,
        u_teknisi.no_hp AS teknisi_no_hp,
        t.alamat AS teknisi_alamat,
        b.layanan_id,
        l.nama_layanan,
        k.nama_kategori,
        b.tanggal_booking,
        b.waktu_booking,
        b.alamat,
        b.latitude,
        b.longitude,
        b.keluhan,
        b.status,
        CAST(b.total_harga AS DOUBLE) AS total_harga,
        b.created_at,
        b.updated_at
      FROM booking b
      JOIN users u_pelanggan ON b.pelanggan_id = u_pelanggan.id
      JOIN layanan l ON b.layanan_id = l.id
      JOIN kategori_jasa k ON l.kategori_id = k.id
      LEFT JOIN teknisi t ON b.teknisi_id = t.id
      LEFT JOIN users u_teknisi ON t.user_id = u_teknisi.id
      WHERE b.id = ? OR b.kode_booking = ?
      LIMIT 1`,
      [id, id]
    );

    if (bookings.length === 0) {
      return errorResponse("Booking tidak ditemukan", 404);
    }

    const booking = bookings[0];

    // Ambil riwayat status booking secara kronologis
    const riwayat = await query(
      `SELECT 
        r.id, 
        r.status, 
        r.catatan, 
        r.diubah_oleh, 
        r.created_at,
        u.nama AS diubah_oleh_nama,
        u.role AS diubah_oleh_role
       FROM riwayat_status_booking r
       LEFT JOIN users u ON r.diubah_oleh = u.id
       WHERE r.booking_id = ?
       ORDER BY r.created_at ASC`,
      [booking.id]
    );

    return successResponse(
      {
        ...booking,
        riwayat_status: riwayat,
      },
      "Data booking ditemukan"
    );
  } catch (error) {
    console.error("GET booking [id] error:", error);
    return errorResponse("Gagal mengambil detail booking", 500, error);
  }
}

// PUT /api/booking/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      status,
      teknisi_id,
      tanggal_booking,
      waktu_booking,
      alamat,
      keluhan,
      total_harga,
      catatan,
      diubah_oleh = null,
    } = body;

    const existing = await query(
      "SELECT * FROM booking WHERE id = ? OR kode_booking = ? LIMIT 1",
      [id, id]
    );

    if (existing.length === 0) {
      return errorResponse("Booking tidak ditemukan", 404);
    }

    const current = existing[0];
    const bookingId = current.id;
    const oldStatus = current.status;
    const newStatus = status ? status.toLowerCase() : oldStatus;

    // Update data booking
    await query(
      `UPDATE booking 
       SET 
         status = ?,
         teknisi_id = ?,
         tanggal_booking = ?,
         waktu_booking = ?,
         alamat = ?,
         keluhan = ?,
         total_harga = ?
       WHERE id = ?`,
      [
        newStatus,
        teknisi_id !== undefined ? (teknisi_id || null) : current.teknisi_id,
        tanggal_booking !== undefined ? tanggal_booking : current.tanggal_booking,
        waktu_booking !== undefined ? waktu_booking : current.waktu_booking,
        alamat !== undefined ? alamat : current.alamat,
        keluhan !== undefined ? keluhan : current.keluhan,
        total_harga !== undefined ? Number(total_harga) : current.total_harga,
        bookingId,
      ]
    );

    // Jika status berubah atau ada catatan khusus, catat ke tabel riwayat_status_booking
    if (newStatus !== oldStatus || catatan) {
      const logNote = catatan || `Status diubah dari ${oldStatus} menjadi ${newStatus}`;
      await query(
        `INSERT INTO riwayat_status_booking (booking_id, status, catatan, diubah_oleh) 
         VALUES (?, ?, ?, ?)`,
        [bookingId, newStatus, logNote, diubah_oleh]
      );
    }

    // Ambil data terbaru
    const [updated] = await query(
      `SELECT 
        b.*,
        u_pelanggan.nama AS pelanggan_nama,
        u_pelanggan.no_hp AS pelanggan_no_hp,
        l.nama_layanan,
        k.nama_kategori,
        u_teknisi.nama AS teknisi_nama
      FROM booking b
      JOIN users u_pelanggan ON b.pelanggan_id = u_pelanggan.id
      JOIN layanan l ON b.layanan_id = l.id
      JOIN kategori_jasa k ON l.kategori_id = k.id
      LEFT JOIN teknisi t ON b.teknisi_id = t.id
      LEFT JOIN users u_teknisi ON t.user_id = u_teknisi.id
      WHERE b.id = ?`,
      [bookingId]
    );

    return successResponse(updated, "Status dan data booking berhasil diperbarui");
  } catch (error) {
    console.error("PUT booking [id] error:", error);
    return errorResponse("Gagal memperbarui booking", 500, error);
  }
}

// DELETE /api/booking/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const existing = await query(
      "SELECT id, status FROM booking WHERE id = ? OR kode_booking = ? LIMIT 1",
      [id, id]
    );

    if (existing.length === 0) {
      return errorResponse("Booking tidak ditemukan", 404);
    }

    const bookingId = existing[0].id;

    // Hapus booking (riwayat_status_booking otomatis terhapus karena CASCADE)
    await query("DELETE FROM booking WHERE id = ?", [bookingId]);

    return successResponse({ id: bookingId }, "Booking berhasil dihapus");
  } catch (error) {
    console.error("DELETE booking [id] error:", error);
    return errorResponse("Gagal menghapus booking", 500, error);
  }
}
