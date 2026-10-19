import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";


// GET /api/users/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const users = await query(
      `SELECT id, nama, email, no_hp, foto, role, status, created_at, updated_at 
       FROM users 
       WHERE id = ? 
       LIMIT 1`,
      [id]
    );

    if (users.length === 0) {
      return errorResponse("Pengguna tidak ditemukan", 404);
    }

    const user = users[0];

    // Ambil data teknisi jika user ber-role teknisi
    let teknisi = null;
    if (user.role === "teknisi") {
      const [t] = await query("SELECT * FROM teknisi WHERE user_id = ? LIMIT 1", [user.id]);
      teknisi = t || null;
    }

    // Ambil ringkasan booking pengguna
    const bookings = await query(
      `SELECT id, kode_booking, tanggal_booking, status, total_harga 
       FROM booking 
       WHERE pelanggan_id = ? OR teknisi_id = (SELECT id FROM teknisi WHERE user_id = ?) 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [user.id, user.id]
    );

    return successResponse(
      {
        ...user,
        teknisi,
        recent_bookings: bookings,
      },
      "Data pengguna ditemukan"
    );
  } catch (error) {
    console.error("GET user [id] error:", error);
    return errorResponse("Gagal mengambil detail pengguna", 500, error);
  }
}

// PUT /api/users/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nama, email, password, no_hp, role, status, foto } = body;

    // Pastikan user ada
    const existing = await query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
    if (existing.length === 0) {
      return errorResponse("Pengguna tidak ditemukan", 404);
    }

    const currentUser = existing[0];

    // Jika ganti email, pastikan tidak duplikat dengan user lain
    if (email && email !== currentUser.email) {
      const checkEmail = await query("SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1", [
        email.trim().toLowerCase(),
        id,
      ]);
      if (checkEmail.length > 0) {
        return errorResponse("Email sudah digunakan pengguna lain", 409);
      }
    }

    let passwordHash = currentUser.password;
    if (password && password.trim().length > 0) {
      passwordHash = bcrypt.hashSync(password, 10);
    }

    await query(
      `UPDATE users 
       SET nama = ?, email = ?, password = ?, no_hp = ?, role = ?, status = ?, foto = ? 
       WHERE id = ?`,
      [
        nama !== undefined ? nama.trim() : currentUser.nama,
        email !== undefined ? email.trim().toLowerCase() : currentUser.email,
        passwordHash,
        no_hp !== undefined ? no_hp : currentUser.no_hp,
        role !== undefined ? role : currentUser.role,
        status !== undefined ? status : currentUser.status,
        foto !== undefined ? foto : currentUser.foto,
        id,
      ]
    );

    const [updatedUser] = await query(
      "SELECT id, nama, email, no_hp, foto, role, status, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );

    return successResponse(updatedUser, "Data pengguna berhasil diperbarui");
  } catch (error) {
    console.error("PUT user [id] error:", error);
    return errorResponse("Gagal memperbarui pengguna", 500, error);
  }
}

// DELETE /api/users/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Cek keberadaan user
    const existing = await query("SELECT id, nama FROM users WHERE id = ? LIMIT 1", [id]);
    if (existing.length === 0) {
      return errorResponse("Pengguna tidak ditemukan", 404);
    }

    // Periksa apakah user memiliki riwayat booking yang aktif
    const bookings = await query(
      "SELECT id FROM booking WHERE pelanggan_id = ? LIMIT 1",
      [id]
    );

    if (bookings.length > 0) {
      // Jika memiliki relasi transaksi, kita ubah status menjadi tidak_aktif untuk menjaga integritas data
      await query("UPDATE users SET status = 'tidak_aktif' WHERE id = ?", [id]);
      return successResponse(
        { id, status: "tidak_aktif" },
        "Pengguna memiliki relasi riwayat transaksi, status diubah menjadi tidak aktif"
      );
    }

    // Jika tidak ada riwayat, hapus permanen
    await query("DELETE FROM users WHERE id = ?", [id]);
    return successResponse({ id }, "Pengguna berhasil dihapus secara permanen");
  } catch (error) {
    console.error("DELETE user [id] error:", error);
    return errorResponse("Gagal menghapus pengguna", 500, error);
  }
}
