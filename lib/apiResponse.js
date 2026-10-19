import { NextResponse } from "next/server";

export function successResponse(data = null, message = "Berhasil", status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(message = "Terjadi kesalahan", status = 400, error = null) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: error ? (error.message || String(error)) : null,
    },
    { status }
  );
}
