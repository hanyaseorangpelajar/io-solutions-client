"use client";

import { useEffect, useMemo, useState } from "react";
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
import AuthLayout from "./AuthLayout";
import FormHeader from "./FormHeader";
import TextField from "@/shared/ui/inputs/TextField";
import PasswordField from "@/shared/ui/inputs/PasswordField";
import { SignUpSchema } from "../model/schema";
import type { SignUpInput } from "../model/types";

// Firebase helpers
import { updateProfile } from "firebase/auth";

/** Skor kekuatan password untuk UI – aman terhadap null/undefined */
function scorePassword(pw?: string | null) {
  const s = pw ?? "";
  let score = 0;
  if (s.length >= 8) score++;
  if (/[a-z]/.test(s)) score++;
  if (/[A-Z]/.test(s)) score++;
  if (/\d/.test(s)) score++;
  if (/[^A-Za-z0-9]/.test(s)) score++;
  return score; // 0..5
}

export function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    // Lebih ramah: error muncul setelah blur/touched
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const name = watch("name");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const pwScore = useMemo(() => scorePassword(password), [password]);
  const pwPercent = (pwScore / 5) * 100;
  const pwColor = pwScore <= 2 ? "red" : pwScore === 3 ? "yellow" : "green";

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setLoading(true);
    setErrMsg(null);
    try {
      const user = await registerWithEmail(email, password);
      if (user && name) {
        await updateProfile(user, { displayName: name });
      }
      window.location.replace("/sysadmin");
    } catch (err: any) {
      setErrMsg(err?.message ?? "Gagal membuat akun. Coba lagi.");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    // Saat password berubah, validasi ulang konfirmasi agar pesan sinkron
    void trigger("confirmPassword");
  }, [password, trigger]);

  return (
    <AuthLayout panelWidth={520}>
      <Stack gap="md">
        <FormHeader
          title="Daftar"
          subtitle="Buat akun baru untuk melanjutkan."
        />

        {errMsg && (
          <Alert color="red" variant="light">
            {errMsg}
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
              <Text size="xs" c="dimmed">
                Kriteria yang disarankan:
              </Text>
              <List size="xs" c="dimmed" withPadding>
                <List.Item>≥ 8 karakter</List.Item>
                <List.Item>Huruf kecil & huruf besar</List.Item>
                <List.Item>Angka</List.Item>
                <List.Item>Simbol (mis. ! @ #)</List.Item>
              </List>
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
                  dan{" "}
                  <Anchor
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                  >
                    Kebijakan Privasi
                  </Anchor>
                  .
                </Text>
              }
              error={errors.acceptTerms?.message}
              // biar dikontrol oleh react-hook-form; jangan pasang `checked={...}`
              {...register("acceptTerms")}
            />

            {/* Tombol selalu aktif; validasi dijalankan saat submit */}
            <Button
              type="submit"
              loading={loading || isSubmitting}
              mt="sm"
              fullWidth
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
