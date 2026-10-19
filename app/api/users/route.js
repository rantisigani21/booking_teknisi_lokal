import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";


// GET /api/users
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let sql = `
      SELECT 
        u.id, 
        u.nama, 
        u.email, 
        u.no_hp, 
        u.foto, 
        u.role, 
        u.status, 
        u.created_at, 
        u.updated_at,
        COUNT(b.id) AS total_booking
      FROM users u
      LEFT JOIN booking b ON u.id = b.pelanggan_id
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      sql += " AND u.role = ?";
      params.push(role);
    }

    if (status) {
      sql += " AND u.status = ?";
      params.push(status);
    }

    if (search) {
      sql += " AND (u.nama LIKE ? OR u.email LIKE ? OR u.no_hp LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += " GROUP BY u.id ORDER BY u.created_at DESC";

    const users = await query(sql, params);
    return successResponse(users, "Data pengguna berhasil diambil");
  } catch (error) {
    console.error("GET users error:", error);
    return errorResponse("Gagal mengambil data pengguna", 500, error);
  }
}

// POST /api/users
export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, email, password, no_hp, role = "pelanggan", status = "aktif" } = body;

    if (!nama || !email || !password) {
      return errorResponse("Nama, email, dan kata sandi wajib diisi", 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    // Cek duplikasi email
    const existing = await query("SELECT id FROM users WHERE email = ? LIMIT 1", [cleanEmail]);
    if (existing.length > 0) {
      return errorResponse("Email sudah digunakan", 409);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await query(
      `INSERT INTO users (nama, email, password, no_hp, role, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nama.trim(), cleanEmail, hashedPassword, no_hp || null, role, status]
    );

    const newUserId = result.insertId;

    if (role === "teknisi") {
      await query(
        `INSERT INTO teknisi (user_id, deskripsi, alamat, status_ketersediaan) 
         VALUES (?, 'Mitra teknisi', '-', 'tersedia')`,
        [newUserId]
      );
    }

    return successResponse(
      {
        id: newUserId,
        nama: nama.trim(),
        email: cleanEmail,
        no_hp: no_hp || null,
        role,
        status,
      },
      "Pengguna baru berhasil ditambahkan",
      201
    );
  } catch (error) {
    console.error("POST users error:", error);
    return errorResponse("Gagal menambahkan pengguna", 500, error);
  }
}
