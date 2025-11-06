"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { SignInForm } from "@/features/auth";

/**
 * Komponen ini berfungsi sebagai "entry-point" untuk halaman sign-in.
 * Ia membungkus form login dan menambahkan logika untuk menampilkan notifikasi
 * error berdasarkan query parameter dari URL.
 */
export default function SignInPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");

    if (typeof error === "string") {
      if (error.toLowerCase().includes("credentials")) {
        notifications.show({
          title: "Login Gagal",
          message: "Username atau password yang Anda masukkan salah.",
          color: "red",
        });
      } else {
        notifications.show({
          title: "Terjadi Kesalahan",
          message: "Gagal melakukan autentikasi. Silakan coba lagi.",
          color: "red",
        });
      }
    }
  }, [searchParams]);

  return <SignInForm />;
}
