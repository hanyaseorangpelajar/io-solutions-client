// src/app/(dashboard)/layout.tsx
"use client"; // Tambahkan ini agar bisa menggunakan hook client-side

import { useEffect, useState } from "react"; // Impor hook
import { useRouter } from "next/navigation"; // Impor hook
import { AppShellLayout, defaultNav } from "@/features/shell";
import { LoadingOverlay } from "@mantine/core"; // Impor komponen loading

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // State untuk status autentikasi

  useEffect(() => {
    // Jalankan hanya di client-side
    const token = localStorage.getItem("authToken");
    if (!token) {
      // Jika tidak ada token, redirect ke sign-in
      console.log("No token found, redirecting to sign-in...");
      router.replace("/sign-in");
      setIsAuthenticated(false);
    } else {
      // Jika ada token, anggap terautentikasi (verifikasi token idealnya dilakukan di sini/di server)
      console.log("Token found, user is authenticated.");
      setIsAuthenticated(true);
    }
  }, [router]); // Tambahkan router sebagai dependency

  // Tampilkan loading saat status autentikasi belum diketahui
  if (isAuthenticated === null) {
    return <LoadingOverlay visible={true} />;
  }

  // Jika sudah jelas tidak terautentikasi (meskipun redirect sedang proses), jangan render layout
  if (isAuthenticated === false) {
    return null; // Atau tampilkan loading lagi
  }

  // Jika terautentikasi, render layout dashboard
  return (
    <AppShellLayout
      navItems={defaultNav}
      headerTitle="I/O SOLUTIONS"
      headerTagline="DATA • INFORMATION • KNOWLEDGE • WISDOM"
      headerHref="/admin" // Sesuaikan default href jika perlu
    >
      {children}
    </AppShellLayout>
  );
}
