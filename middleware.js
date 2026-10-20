import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Abaikan file statis, next internal, aset gambar/ikon, dan API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Baca session cookie
  const sessionCookie = request.cookies.get("bt_session")?.value;
  let session = null;
  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie);
    } catch {}
  }

  // 3. PROTEKSI AREA ADMIN (/admin/*)
  if (pathname.startsWith("/admin")) {
    // Izinkan halaman login admin
    if (pathname === "/admin/login") {
      // Jika sudah login sebagai admin, langsung redirect ke dashboard admin
      if (session && session.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Jika belum login atau bukan admin, redirect ke login admin
    if (!session || session.role !== "admin") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. PROTEKSI AREA TEKNISI (/teknisi/*)
  if (pathname.startsWith("/teknisi")) {
    // Izinkan halaman login teknisi
    if (pathname === "/teknisi/login") {
      // Jika sudah login sebagai teknisi, langsung redirect ke dashboard teknisi
      if (session && session.role === "teknisi") {
        return NextResponse.redirect(new URL("/teknisi", request.url));
      }
      return NextResponse.next();
    }

    // Jika belum login atau bukan teknisi, redirect ke login teknisi
    if (!session || session.role !== "teknisi") {
      const loginUrl = new URL("/teknisi/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. PROTEKSI AREA PELANGGAN (/pelanggan/* dan alias)
  const isPelangganProtected =
    pathname.startsWith("/pelanggan") ||
    pathname === "/booking" ||
    pathname === "/riwayat-booking" ||
    pathname === "/profil";

  if (isPelangganProtected) {
    // Izinkan halaman login pelanggan
    if (pathname === "/pelanggan/login" || pathname === "/login" || pathname === "/masuk") {
      // Jika sudah login sebagai pelanggan, langsung redirect ke dashboard pelanggan
      if (session && session.role === "pelanggan") {
        return NextResponse.redirect(new URL("/pelanggan", request.url));
      }
      return NextResponse.next();
    }

    // Jika belum login atau bukan pelanggan, redirect ke login pelanggan
    if (!session || session.role !== "pelanggan") {
      const loginUrl = new URL("/pelanggan/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teknisi/:path*",
    "/pelanggan/:path*",
    "/booking",
    "/riwayat-booking",
    "/profil",
    "/login",
    "/masuk",
  ],
};
