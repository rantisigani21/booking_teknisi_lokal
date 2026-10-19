import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";


// GET /api/kategori-jasa
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let sql = `
      SELECT 
        k.id, 
        k.nama_kategori, 
        k.deskripsi, 
        k.status, 
        k.created_at, 
        k.updated_at,
        COUNT(l.id) AS jumlah_layanan
      FROM kategori_jasa k
      LEFT JOIN layanan l ON k.id = l.kategori_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += " AND k.status = ?";
      params.push(status);
    }

    sql += " GROUP BY k.id ORDER BY k.id ASC";

    const categories = await query(sql, params);
    return successResponse(categories, "Data kategori jasa berhasil diambil");
  } catch (error) {
    console.error("GET kategori-jasa error:", error);
    return errorResponse("Gagal mengambil kategori jasa", 500, error);
  }
}

// POST /api/kategori-jasa
export async function POST(request) {
  try {
    const body = await request.json();
    const { nama_kategori, deskripsi, status = "aktif" } = body;

    if (!nama_kategori || !nama_kategori.trim()) {
      return errorResponse("Nama kategori wajib diisi", 400);
    }

    const result = await query(
      `INSERT INTO kategori_jasa (nama_kategori, deskripsi, status) 
       VALUES (?, ?, ?)`,
      [nama_kategori.trim(), deskripsi || null, status]
    );

    const [newCategory] = await query("SELECT * FROM kategori_jasa WHERE id = ?", [result.insertId]);

    return successResponse(newCategory, "Kategori jasa berhasil ditambahkan", 201);
  } catch (error) {
    console.error("POST kategori-jasa error:", error);
    return errorResponse("Gagal menambahkan kategori jasa", 500, error);
  }
}
