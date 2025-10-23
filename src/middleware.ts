// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar path yang dianggap sebagai halaman publik (tidak perlu login)
const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value; // Coba ambil dari cookie dulu

  // Jika tidak ada token di cookie, coba cek header (untuk API routes jika perlu, tapi fokus ke UI)
  // const authHeader = request.headers.get('Authorization');
  // const tokenFromHeader = authHeader?.split(' ')[1];
  // const finalToken = token || tokenFromHeader;

  const finalToken = token; // Untuk sekarang fokus pada UI, kita anggap token disimpan di cookie atau localStorage

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // --- Logika Proteksi ---

  // 1. Jika pengguna mencoba mengakses halaman dashboard TANPA token
  if (!finalToken && !isPublicPath) {
    // Redirect ke halaman login
    const loginUrl = new URL("/sign-in", request.url);
    // Tambahkan parameter 'redirectedFrom' agar kita tahu dari mana dia dialihkan (opsional)
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika pengguna mencoba mengakses halaman login/register TAPI SUDAH punya token
  if (finalToken && isPublicPath) {
    // Redirect ke halaman dashboard default (misal /admin, sesuaikan)
    // TODO: Idealnya redirect berdasarkan role dari token jika memungkinkan,
    // tapi itu lebih kompleks karena middleware berjalan di edge.
    // Untuk sementara, kita redirect ke halaman umum dashboard.
    const dashboardUrl = new URL("/admin", request.url); // Asumsi /admin sebagai default
    return NextResponse.redirect(dashboardUrl);
  }

  // Jika tidak ada kondisi redirect yang terpenuhi, lanjutkan request seperti biasa
  return NextResponse.next();
}

// --- Konfigurasi Matcher ---
// Tentukan path mana saja yang akan DIJALANKAN oleh middleware ini
export const config = {
  matcher: [
    /*
     * Cocokkan semua path KECUALI yang:
     * - Dimulai dengan /api/ (rute API Next.js)
     * - Dimulai dengan /_next/static (file statis Next.js)
     * - Dimulai dengan /_next/image (optimasi gambar Next.js)
     * - Dimulai dengan /favicon.ico (icon)
     * - Dimulai dengan /public (folder public)
     * Ini penting agar middleware tidak mengganggu aset statis.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
