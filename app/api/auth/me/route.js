import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return errorResponse("Tidak terautentikasi", 401);
    }

    const users = await query(
      `SELECT id, nama, email, no_hp, foto, role, status 
       FROM users 
       WHERE id = ? 
       LIMIT 1`,
      [session.id]
    );

    if (users.length === 0) {
      return errorResponse("Pengguna tidak ditemukan", 404);
    }

    const user = users[0];

    // Ambil data teknisi jika user ber-role teknisi
    let teknisiInfo = null;
    if (user.role === "teknisi") {
      const [tech] = await query(
        `SELECT id, deskripsi, alamat, status_ketersediaan 
         FROM teknisi 
         WHERE user_id = ? 
         LIMIT 1`,
        [user.id]
      );
      teknisiInfo = tech || null;
    }

    return successResponse(
      {
        ...user,
        teknisi: teknisiInfo,
      },
      "Sesi valid"
    );
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return errorResponse("Gagal memverifikasi sesi", 500, error);
  }
}
