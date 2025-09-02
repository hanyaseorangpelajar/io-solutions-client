"use client";

import { useState } from "react";
import { Alert, Anchor, Button, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

import AuthLayout from "./AuthLayout";
import FormHeader from "./FormHeader";
import TextField from "@/shared/ui/inputs/TextField";
import PasswordField from "@/shared/ui/inputs/PasswordField";

export function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrMsg(null);
    try {
      // Logic otentikasi akan ditambahkan di sini
      console.log("Attempting to sign in with:", { email, password });
      setLoading(false);
      // Simulasikan login berhasil
      router.replace("/sysadmin");
    } catch (err: any) {
      setErrMsg(err?.message ?? "Gagal masuk. Periksa email & kata sandi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout panelWidth={420}>
      <Stack gap="md">
        <FormHeader title="Masuk" subtitle="Gunakan email dan kata sandi" />

        {errMsg && (
          <Alert color="red" variant="light">
            {errMsg}
          </Alert>
        )}

        <form onSubmit={handleEmailSignIn} noValidate>
          <Stack gap="sm">
            <TextField
              label="Email"
              placeholder="you@domain.com"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
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
