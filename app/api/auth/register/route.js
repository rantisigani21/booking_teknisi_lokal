import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";


export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, email, password, no_hp, role = "pelanggan", deskripsi, alamat } = body;

    if (!nama || !email || !password) {
      return errorResponse("Nama, email, dan kata sandi wajib diisi", 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    // Cek apakah email sudah terdaftar
    const existing = await query("SELECT id FROM users WHERE email = ? LIMIT 1", [cleanEmail]);
    if (existing.length > 0) {
      return errorResponse("Email sudah terdaftar. Gunakan email lain.", 409);
    }

    // Hash kata sandi
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Validasi role
    const validRoles = ["pelanggan", "teknisi", "admin"];
    const userRole = validRoles.includes(role) ? role : "pelanggan";

    // Simpan user baru
    const insertResult = await query(
      `INSERT INTO users (nama, email, password, no_hp, role, status) 
       VALUES (?, ?, ?, ?, ?, 'aktif')`,
      [nama.trim(), cleanEmail, hashedPassword, no_hp || null, userRole]
    );

    const newUserId = insertResult.insertId;

    // Jika yang mendaftar adalah teknisi, buat juga profil teknisi default
    if (userRole === "teknisi") {
      await query(
        `INSERT INTO teknisi (user_id, deskripsi, alamat, status_ketersediaan) 
         VALUES (?, ?, ?, 'tersedia')`,
        [
          newUserId,
          deskripsi || "Mitra teknisi baru",
          alamat || "Belum diatur",
        ]
      );
    }

    return successResponse(
      {
        id: newUserId,
        nama: nama.trim(),
        email: cleanEmail,
        no_hp: no_hp || null,
        role: userRole,
        status: "aktif",
      },
      "Pendaftaran akun berhasil",
      201
    );
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("Gagal melakukan pendaftaran akun", 500, error);
  }
}
