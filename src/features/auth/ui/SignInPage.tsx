"use client";

import { useState } from "react";
import { Alert, Anchor, Button, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import AuthLayout from "./AuthLayout";
import FormHeader from "./FormHeader";
import { TextField } from "@/shared/ui";
import { PasswordField } from "@/shared/ui";

// ... (Interface LoginResponse tetap sama) ...
interface LoginResponse {
  message: string;
  user: {
    _id: string;
    username: string;
    fullName: string;
    role: string;
  };
  token: string;
}

export function SignInPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrMsg(null);

    try {
      console.log("Attempting to sign in with:", {
        username: usernameOrEmail,
        password,
      });

      // --- PERBAIKAN: Hasilnya sudah data, bukan AxiosResponse ---
      // Kita beri tahu TypeScript bahwa hasilnya adalah LoginResponse
      const loginData: LoginResponse = await apiClient.post("/auth/login", {
        username: usernameOrEmail,
        password: password,
      });
      // --- AKHIR PERBAIKAN ---

      // --- SAFETY CHECK & LOGGING (sedikit diubah) ---
      console.log("Data received from apiClient (loginData):", loginData); // Log data yang diterima
      if (!loginData) {
        // Ini seharusnya tidak terjadi jika interceptor bekerja
        throw new Error("Respons dari server tidak berisi data login.");
      }
      // --- AKHIR SAFETY CHECK ---

      // Akses token dan user langsung dari loginData
      if (loginData.token) {
        console.log("Token found:", loginData.token); // Log token
        localStorage.setItem("authToken", loginData.token);
        // localStorage.setItem('userData', JSON.stringify(loginData.user)); // Opsional

        // Redirect berdasarkan role
        console.log("Redirecting based on role:", loginData.user.role); // Log role
        // Pastikan role ada sebelum redirect
        if (loginData.user && loginData.user.role) {
          router.replace(`/${loginData.user.role.toLowerCase()}`); // -> /admin, /teknisi, /sysadmin
        } else {
          console.error(
            "Data user atau role tidak ditemukan dalam respons:",
            loginData
          );
          throw new Error("Data user tidak lengkap dari server.");
        }
      } else {
        // Ini seharusnya tidak terjadi jika loginData ada tapi token tidak ada
        console.error("Login data received, but token is missing:", loginData);
        throw new Error("Token tidak ditemukan dalam respons server.");
      }
    } catch (err: any) {
      console.error("Login failed in catch block:", err);
      // Pesan error dari interceptor (jika ada) atau fallback
      setErrMsg(
        err?.message || "Gagal masuk. Periksa username/email & kata sandi."
      );
    } finally {
      setLoading(false);
    }
  }

  // ... (return JSX tetap sama) ...
  return (
    <AuthLayout panelWidth={420}>
      <Stack gap="md">
        <FormHeader
          title="Masuk"
          subtitle="Gunakan username atau email dan kata sandi"
        />

        {errMsg && (
          <Alert color="red" variant="light" title="Login Gagal">
            {errMsg}
          </Alert>
        )}

        <form onSubmit={handleEmailSignIn} noValidate>
          <Stack gap="sm">
            <TextField
              label="Username atau Email"
              placeholder="username atau you@domain.com"
              type="text"
              autoComplete="username"
              required
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.currentTarget.value)}
            />

            <PasswordField
              label="Kata sandi"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />

            <Button type="submit" loading={loading} mt="sm" fullWidth>
              Masuk
            </Button>

            <Text c="dimmed" size="sm" ta="center">
              <Anchor href="/forgot-password" size="sm">
                Lupa kata sandi?
              </Anchor>
              {" · "}
              Belum punya akun?{" "}
              <Anchor href="/sign-up" size="sm">
                Daftar
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Stack>
    </AuthLayout>
  );
}
