import { clearSessionCookie } from "@/lib/auth";
import { successResponse } from "@/lib/apiResponse";

// POST /api/auth/logout
export async function POST() {
  await clearSessionCookie();
  return successResponse(null, "Logout berhasil");
}
