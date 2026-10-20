import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/auth";


// GET /api/teknisi
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status_ketersediaan = searchParams.get("status_ketersediaan");
    const status_user = searchParams.get("status_user");
    const include_all = searchParams.get("include_all") === "true";
    const search = searchParams.get("search");

    let sql = `
      SELECT 
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
      WHERE 1=1
    `;
    const params = [];

    // Jika dipanggil oleh publik / booking (tanpa include_all), hanya tampilkan teknisi yang status user-nya 'aktif'
    if (status_user) {
      sql += " AND u.status = ?";
      params.push(status_user);
    } else if (!include_all) {
      sql += " AND u.status = 'aktif'";
    }

    if (status_ketersediaan) {
      sql += " AND t.status_ketersediaan = ?";
      params.push(status_ketersediaan);
    }

    if (search) {
      sql += " AND (u.nama LIKE ? OR t.deskripsi LIKE ? OR t.alamat LIKE ? OR u.no_hp LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += " GROUP BY t.id ORDER BY t.id ASC";

    const technicians = await query(sql, params);

    // Ambil relasi layanan yang dikerjakan oleh masing-masing teknisi
    const techIds = technicians.map((t) => t.id);
    let techServicesMap = {};

    if (techIds.length > 0) {
      const placeholders = techIds.map(() => "?").join(",");
      const services = await query(
        `SELECT 
          tl.teknisi_id, 
          tl.layanan_id, 
          l.nama_layanan, 
          k.nama_kategori, 
          COALESCE(tl.harga, l.harga) AS harga
         FROM teknisi_layanan tl
         JOIN layanan l ON tl.layanan_id = l.id
         JOIN kategori_jasa k ON l.kategori_id = k.id
         WHERE tl.teknisi_id IN (${placeholders})`,
        techIds
      );

      for (const item of services) {
        if (!techServicesMap[item.teknisi_id]) {
          techServicesMap[item.teknisi_id] = [];
        }
        techServicesMap[item.teknisi_id].push(item);
      }
    }

    const dataWithServices = technicians.map((t) => ({
      ...t,
      rating: 4.8, // Default rating reputasi mitra
      layanan: techServicesMap[t.id] || [],
    }));

    return successResponse(dataWithServices, "Data teknisi berhasil diambil");
  } catch (error) {
    console.error("GET teknisi error:", error);
    return errorResponse("Gagal mengambil data teknisi", 500, error);
  }
}

// POST /api/teknisi — hanya admin
export async function POST(request) {
  const authError = await requireAuth(["admin"]);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      user_id,
      deskripsi,
      alamat,
      latitude = null,
      longitude = null,
      status_ketersediaan = "tersedia",
      layanan_ids = [],
    } = body;

    if (!user_id) {
      return errorResponse("user_id wajib disertakan", 400);
    }

    // Pastikan user ada
    const userCheck = await query("SELECT id, role FROM users WHERE id = ? LIMIT 1", [user_id]);
    if (userCheck.length === 0) {
      return errorResponse("User tidak ditemukan", 404);
    }

    // Pastikan belum ada entri teknisi untuk user ini
    const existing = await query("SELECT id FROM teknisi WHERE user_id = ? LIMIT 1", [user_id]);
    if (existing.length > 0) {
      return errorResponse("Profil teknisi untuk user ini sudah terdaftar", 409);
    }

    // Update role user menjadi teknisi jika belum
    if (userCheck[0].role !== "teknisi") {
      await query("UPDATE users SET role = 'teknisi' WHERE id = ?", [user_id]);
    }

    // Insert ke tabel teknisi
    const insertResult = await query(
      `INSERT INTO teknisi (user_id, deskripsi, alamat, latitude, longitude, status_ketersediaan) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, deskripsi || null, alamat || null, latitude, longitude, status_ketersediaan]
    );

    const newTeknisiId = insertResult.insertId;

    // Hubungkan layanan jika disediakan
    if (Array.isArray(layanan_ids) && layanan_ids.length > 0) {
      for (const layId of layanan_ids) {
        await query(
          "INSERT IGNORE INTO teknisi_layanan (teknisi_id, layanan_id) VALUES (?, ?)",
          [newTeknisiId, layId]
        );
      }
    }

    const [created] = await query("SELECT * FROM teknisi WHERE id = ?", [newTeknisiId]);
    return successResponse(created, "Profil teknisi berhasil dibuat", 201);
  } catch (error) {
    console.error("POST teknisi error:", error);
    return errorResponse("Gagal membuat profil teknisi", 500, error);
  }
}
