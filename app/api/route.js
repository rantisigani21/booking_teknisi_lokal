import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/apiResponse";


export async function GET() {
  try {
    // Test database connection
    const [dbCheck] = await query("SELECT DATABASE() as db_name, VERSION() as version");

    return successResponse(
      {
        appName: "Booking Teknisi Lokal API",
        version: "1.0.0",
        database: {
          connected: true,
          databaseName: dbCheck?.db_name || "booking_teknisi_lokal",
          serverVersion: dbCheck?.version || "Unknown",
        },
        endpoints: [
          { method: "POST", path: "/api/auth/login", description: "Login user (admin, teknisi, pelanggan)" },
          { method: "POST", path: "/api/auth/register", description: "Register new user" },
          { method: "GET", path: "/api/users", description: "List all users with filters & search" },
          { method: "POST", path: "/api/users", description: "Create a new user" },
          { method: "GET/PUT/DELETE", path: "/api/users/[id]", description: "Get, update, or delete user by ID" },
          { method: "GET", path: "/api/kategori-jasa", description: "List categories with services count" },
          { method: "POST", path: "/api/kategori-jasa", description: "Create category" },
          { method: "GET/PUT/DELETE", path: "/api/kategori-jasa/[id]", description: "Get, update, or delete category" },
          { method: "GET", path: "/api/layanan", description: "List services with category join" },
          { method: "POST", path: "/api/layanan", description: "Create service" },
          { method: "GET/PUT/DELETE", path: "/api/layanan/[id]", description: "Get, update, or delete service" },
          { method: "GET", path: "/api/teknisi", description: "List technicians with profile, user info & services" },
          { method: "POST", path: "/api/teknisi", description: "Register or create technician profile" },
          { method: "GET/PUT/DELETE", path: "/api/teknisi/[id]", description: "Get, update, or delete technician" },
          { method: "GET", path: "/api/booking", description: "List bookings with full joins (customer, tech, service)" },
          { method: "POST", path: "/api/booking", description: "Create a new booking & log initial status" },
          { method: "GET/PUT/DELETE", path: "/api/booking/[id]", description: "Get with status timeline, update status, cancel" },
          { method: "GET", path: "/api/stats", description: "Dashboard overview statistics & metrics" },
        ],
      },
      "API Booking Teknisi Lokal aktif dan terhubung ke database MySQL"
    );
  } catch (error) {
    return errorResponse("Gagal menghubungkan ke database MySQL", 500, error);
  }
}
