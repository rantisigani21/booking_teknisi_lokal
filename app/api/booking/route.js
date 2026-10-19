import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";


// GET /api/booking
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const pelanggan_id = searchParams.get("pelanggan_id");
    const teknisi_id = searchParams.get("teknisi_id");
    const tanggal = searchParams.get("tanggal");
    const search = searchParams.get("search");

    let sql = `
      SELECT 
        b.id,
        b.kode_booking,
        b.pelanggan_id,
        u_pelanggan.nama AS pelanggan_nama,
        u_pelanggan.no_hp AS pelanggan_no_hp,
        u_pelanggan.email AS pelanggan_email,
        b.teknisi_id,
        u_teknisi.nama AS teknisi_nama,
        u_teknisi.no_hp AS teknisi_no_hp,
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
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== "Semua") {
      sql += " AND b.status = ?";
      params.push(status.toLowerCase());
    }

    if (pelanggan_id) {
      sql += " AND b.pelanggan_id = ?";
      params.push(pelanggan_id);
    }

    if (teknisi_id) {
      sql += " AND b.teknisi_id = ?";
      params.push(teknisi_id);
    }

    if (tanggal) {
      sql += " AND b.tanggal_booking = ?";
      params.push(tanggal);
    }

    if (search) {
      sql += ` AND (
        b.kode_booking LIKE ? OR 
        u_pelanggan.nama LIKE ? OR 
        u_pelanggan.no_hp LIKE ? OR 
        u_teknisi.nama LIKE ? OR 
        l.nama_layanan LIKE ? OR 
        b.alamat LIKE ? OR
        b.keluhan LIKE ?
      )`;
      const term = `%${search}%`;
      params.push(term, term, term, term, term, term, term);
    }

    sql += " ORDER BY b.created_at DESC";

    const bookings = await query(sql, params);
    return successResponse(bookings, "Data booking berhasil diambil");
  } catch (error) {
    console.error("GET booking error:", error);
    return errorResponse("Gagal mengambil data booking", 500, error);
  }
}

// POST /api/booking
export async function POST(request) {
  try {
    const body = await request.json();
    let {
      pelanggan_id,
      pelanggan_nama,
      pelanggan_no_hp,
      teknisi_id = null,
      layanan_id,
      tanggal_booking,
      waktu_booking,
      alamat,
      latitude = null,
      longitude = null,
      keluhan = "",
      total_harga = null,
    } = body;

    if (!layanan_id || !tanggal_booking || !waktu_booking || !alamat) {
      return errorResponse("Layanan, tanggal, waktu booking, dan alamat wajib diisi", 400);
    }

    // Jika pelanggan_id belum ada tapi ada nama & hp, cari atau daftarkan user baru
    if (!pelanggan_id && pelanggan_no_hp) {
      const existing = await query("SELECT id FROM users WHERE no_hp = ? LIMIT 1", [pelanggan_no_hp]);
      if (existing.length > 0) {
        pelanggan_id = existing[0].id;
      } else {
        const dummyEmail = `pelanggan_${Date.now()}@bookingteknisi.local`;
        const newUser = await query(
          "INSERT INTO users (nama, email, password, no_hp, role, status) VALUES (?, ?, ?, ?, 'pelanggan', 'aktif')",
          [pelanggan_nama || "Pelanggan", dummyEmail, "default123", pelanggan_no_hp]
        );
        pelanggan_id = newUser.insertId;
      }
    } else if (!pelanggan_id) {
      // Ambil user pelanggan pertama yang aktif sebagai fallback
      const [firstUser] = await query("SELECT id FROM users WHERE role = 'pelanggan' LIMIT 1");
      pelanggan_id = firstUser ? firstUser.id : 1;
    }

    // Cek detail layanan untuk total_harga jika belum ditentukan
    const [layanan] = await query("SELECT id, harga, nama_layanan FROM layanan WHERE id = ? LIMIT 1", [layanan_id]);
    if (!layanan) {
      return errorResponse("Layanan yang dipilih tidak valid", 404);
    }

    const finalHarga = total_harga !== null ? Number(total_harga) : Number(layanan.harga);

    // Format waktu jika mengandung WIB
    const cleanWaktu = String(waktu_booking).replace(/\s*WIB/i, "").trim();

    // Buat kode booking unik format BKG-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const kodeBooking = `BKG-${dateStr}-${randomSuffix}`;

    // Simpan ke tabel booking
    const result = await query(
      `INSERT INTO booking (
        kode_booking,
        pelanggan_id,
        teknisi_id,
        layanan_id,
        tanggal_booking,
        waktu_booking,
        alamat,
        latitude,
        longitude,
        keluhan,
        status,
        total_harga
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'menunggu', ?)`,
      [
        kodeBooking,
        pelanggan_id,
        teknisi_id || null,
        layanan_id,
        tanggal_booking,
        cleanWaktu,
        alamat,
        latitude,
        longitude,
        keluhan,
        finalHarga,
      ]
    );

    const newBookingId = result.insertId;

    // Masukkan log ke tabel riwayat_status_booking
    await query(
      `INSERT INTO riwayat_status_booking (booking_id, status, catatan, diubah_oleh) 
       VALUES (?, 'menunggu', 'Booking baru berhasil dibuat', ?)`,
      [newBookingId, pelanggan_id]
    );

    // Ambil data lengkap booking yang baru dibuat
    const [created] = await query(
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
      [newBookingId]
    );

    return successResponse(created, "Booking berhasil dibuat", 201);
  } catch (error) {
    console.error("POST booking error:", error);
    return errorResponse("Gagal membuat booking baru", 500, error);
  }
}
