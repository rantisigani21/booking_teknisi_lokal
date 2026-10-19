import { cookies } from "next/headers";
import { errorResponse } from "@/lib/apiResponse";

const COOKIE_NAME = "bt_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

/**
 * Set session cookie setelah login berhasil.
 * @param {{ id: number, role: string, nama: string }} userData
 */
export async function setSessionCookie(userData) {
  const cookieStore = await cookies();
  const payload = JSON.stringify({
    id: userData.id,
    role: userData.role,
    nama: userData.nama,
  });

  cookieStore.set(COOKIE_NAME, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/**
 * Hapus session cookie saat logout.
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Baca dan parse session dari cookie.
 * @returns {{ id: number, role: string, nama: string } | null}
 */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(COOKIE_NAME)?.value;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Guard untuk endpoint yang membutuhkan login.
 * Kembalikan null jika valid, atau Response error jika tidak.
 * @param {string[]} allowedRoles - role yang diizinkan, misal ['admin'] atau ['admin','teknisi']
 * @returns {Response | null}
 */
export async function requireAuth(allowedRoles = []) {
  const session = await getSession();

  if (!session) {
    return errorResponse("Sesi tidak ditemukan. Silakan login terlebih dahulu.", 401);
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return errorResponse(
      `Akses ditolak. Hanya ${allowedRoles.join(" atau ")} yang diizinkan.`,
      403
    );
  }

  return null; // autentikasi berhasil
}
