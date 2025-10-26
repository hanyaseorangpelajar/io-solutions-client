"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Anchor,
  Button,
  Checkbox,
  List,
  Progress,
  Stack,
  Text,
  Alert,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import AuthLayout from "./AuthLayout";
import FormHeader from "./FormHeader";
import TextField from "@/shared/ui/inputs/TextField";
import PasswordField from "@/shared/ui/inputs/PasswordField";
import { SignUpSchema } from "../model/schema";
import type { SignUpInput } from "../model/types";

function scorePassword(pw?: string | null) {
  const s = pw ?? "";
  let score = 0;
  if (s.length >= 8) score++;
  if (/[a-z]/.test(s)) score++;
  if (/[A-Z]/.test(s)) score++;
  if (/\d/.test(s)) score++;
  if (/[^A-Za-z0-9]/.test(s)) score++;
  return score;
}

export function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const name = watch("name");
  const username = watch("username");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const pwScore = useMemo(() => scorePassword(password), [password]);
  const pwPercent = (pwScore / 5) * 100;
  const pwColor = pwScore <= 2 ? "red" : pwScore === 3 ? "yellow" : "green";

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setErrMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      };

      console.log("Mengirim data registrasi:", payload);

      const response = await apiClient.post("/auth/register", payload);

      console.log("Registrasi berhasil:", response.data);
      setSuccessMsg(
        "Registrasi berhasil! Anda akan diarahkan ke halaman login."
      );
      setLoading(false);

      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (err: any) {
      console.error("Registrasi gagal:", err);
      const apiError = err.response?.data?.message;
      setErrMsg(
        apiError || err?.message || "Gagal membuat akun. Silakan coba lagi."
      );
      setLoading(false);
    }
  });

  return (
    <AuthLayout panelWidth={520}>
      <Stack gap="md">
        <FormHeader
          title="Daftar"
          subtitle="Buat akun baru untuk melanjutkan."
        />

        {errMsg && (
          <Alert color="red" variant="light" title="Registrasi Gagal">
            {errMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert color="green" variant="light">
            {successMsg}
          </Alert>
        )}

        <form onSubmit={onSubmit} noValidate>
          <Stack gap="sm">
            <TextField
              label="Nama lengkap"
              placeholder="Nama kamu"
              autoComplete="name"
              autoFocus
              error={errors.name?.message}
              {...register("name")}
            />

            <TextField
              label="Username"
              placeholder="username_unik"
              autoComplete="username"
              error={errors.username?.message}
              {...register("username")}
            />

            <TextField
              label="Email"
              placeholder="you@domain.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Stack gap={4}>
              <PasswordField
                label="Kata sandi"
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                error={errors.password?.message}
                showCapsLockHint
                {...register("password")}
              />
              <Progress value={pwPercent} color={pwColor} size="sm" />
            </Stack>

            <PasswordField
              label="Konfirmasi kata sandi"
              placeholder="Ulangi kata sandi"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            {confirmPassword && confirmPassword !== password && (
              <Text size="xs" c="red.6">
                Kata sandi tidak cocok
              </Text>
            )}

            <Checkbox
              label={
                <Text size="sm">
                  Saya menyetujui{" "}
                  <Anchor
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                  >
                    Syarat & Ketentuan
                  </Anchor>{" "}
                </Text>
              }
              error={errors.acceptTerms?.message}
              {...register("acceptTerms")}
            />

            <Button
              type="submit"
              loading={loading || isSubmitting}
              mt="sm"
              fullWidth
              disabled={!!successMsg}
            >
              Buat akun
            </Button>

            <Text size="sm" ta="center">
              Sudah punya akun?{" "}
              <Anchor size="sm" href="/sign-in">
                Masuk
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Stack>
    </AuthLayout>
  );
}
