import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";


// GET /api/layanan
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori_id = searchParams.get("kategori_id");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let sql = `
      SELECT 
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
      WHERE 1=1
    `;
    const params = [];

    if (kategori_id) {
      sql += " AND l.kategori_id = ?";
      params.push(kategori_id);
    }

    if (status) {
      sql += " AND l.status = ?";
      params.push(status);
    }

    if (search) {
      sql += " AND (l.nama_layanan LIKE ? OR l.deskripsi LIKE ? OR k.nama_kategori LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += " ORDER BY l.id ASC";

    const services = await query(sql, params);
    return successResponse(services, "Data layanan berhasil diambil");
  } catch (error) {
    console.error("GET layanan error:", error);
    return errorResponse("Gagal mengambil data layanan", 500, error);
  }
}

// POST /api/layanan
export async function POST(request) {
  try {
    const body = await request.json();
    const { kategori_id, nama_layanan, deskripsi, harga = 0, status = "aktif" } = body;

    if (!kategori_id || !nama_layanan || !nama_layanan.trim()) {
      return errorResponse("Kategori ID dan nama layanan wajib diisi", 400);
    }

    // Pastikan kategori valid
    const cat = await query("SELECT id FROM kategori_jasa WHERE id = ? LIMIT 1", [kategori_id]);
    if (cat.length === 0) {
      return errorResponse("Kategori yang dipilih tidak valid", 404);
    }

    const numHarga = Number(harga) || 0;

    const result = await query(
      `INSERT INTO layanan (kategori_id, nama_layanan, deskripsi, harga, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [kategori_id, nama_layanan.trim(), deskripsi || null, numHarga, status]
    );

    const [newService] = await query(
      `SELECT l.*, k.nama_kategori 
       FROM layanan l 
       JOIN kategori_jasa k ON l.kategori_id = k.id 
       WHERE l.id = ?`,
      [result.insertId]
    );

    return successResponse(newService, "Layanan baru berhasil ditambahkan", 201);
  } catch (error) {
    console.error("POST layanan error:", error);
    return errorResponse("Gagal menambahkan layanan", 500, error);
  }
}
