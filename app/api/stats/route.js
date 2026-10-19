import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/auth";


// GET /api/stats — hanya admin
export async function GET() {
  const authError = await requireAuth(["admin"]);
  if (authError) return authError;

  try {
    // 1. Hitung total pengguna (pelanggan)
    const [userStats] = await query(`
      SELECT 
        COUNT(CASE WHEN role = 'pelanggan' THEN 1 END) AS total_pelanggan,
        COUNT(CASE WHEN role = 'teknisi' THEN 1 END) AS total_teknisi,
        COUNT(*) AS total_semua_pengguna
      FROM users
    `);

    // 2. Hitung statistik booking
    const [bookingStats] = await query(`
      SELECT 
        COUNT(*) AS total_booking,
        COUNT(CASE WHEN status = 'menunggu' THEN 1 END) AS booking_menunggu,
        COUNT(CASE WHEN status = 'diterima' THEN 1 END) AS booking_diterima,
        COUNT(CASE WHEN status = 'diproses' THEN 1 END) AS booking_diproses,
        COUNT(CASE WHEN status = 'selesai' THEN 1 END) AS booking_selesai,
        COUNT(CASE WHEN status = 'dibatalkan' THEN 1 END) AS booking_dibatalkan,
        COALESCE(SUM(CASE WHEN status = 'selesai' THEN total_harga ELSE 0 END), 0) AS total_pendapatan
      FROM booking
    `);

    // 3. Hitung total kategori dan layanan
    const [serviceStats] = await query(`
      SELECT 
        (SELECT COUNT(*) FROM kategori_jasa WHERE status = 'aktif') AS total_kategori,
        (SELECT COUNT(*) FROM layanan WHERE status = 'aktif') AS total_layanan
    `);

    // 4. Ambil 5 booking terbaru untuk dashboard
    const recentBookings = await query(`
      SELECT 
        b.id,
        b.kode_booking,
        u_pelanggan.nama AS pelanggan,
        u_pelanggan.no_hp AS pelanggan_hp,
        b.alamat,
        u_teknisi.nama AS teknisi,
        l.nama_layanan AS layanan,
        k.nama_kategori AS kategori,
        b.tanggal_booking AS tanggal,
        b.waktu_booking AS jam,
        b.status,
        b.total_harga AS biaya,
        b.keluhan
      FROM booking b
      JOIN users u_pelanggan ON b.pelanggan_id = u_pelanggan.id
      JOIN layanan l ON b.layanan_id = l.id
      JOIN kategori_jasa k ON l.kategori_id = k.id
      LEFT JOIN teknisi t ON b.teknisi_id = t.id
      LEFT JOIN users u_teknisi ON t.user_id = u_teknisi.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `);

    return successResponse(
      {
        totalPengguna: userStats.total_pelanggan || 0,
        totalTeknisi: userStats.total_teknisi || 0,
        totalBooking: bookingStats.total_booking || 0,
        bookingMenunggu: bookingStats.booking_menunggu || 0,
        bookingDiterima: bookingStats.booking_diterima || 0,
        bookingDiproses: bookingStats.booking_diproses || 0,
        bookingSelesai: bookingStats.booking_selesai || 0,
        bookingDibatalkan: bookingStats.booking_dibatalkan || 0,
        totalPendapatan: Number(bookingStats.total_pendapatan || 0),
        totalKategori: serviceStats.total_kategori || 0,
        totalLayanan: serviceStats.total_layanan || 0,
        bookingTerbaru: recentBookings,
      },
      "Data ringkasan statistik berhasil diambil"
    );
  } catch (error) {
    console.error("GET stats error:", error);
    return errorResponse("Gagal mengambil statistik dashboard", 500, error);
  }
}
