"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  List,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import AuthLayout from "./AuthLayout";
import FormHeader from "./FormHeader";
import SSOButtons from "./SSOButtons";
import TextField from "@/shared/ui/inputs/TextField";
import PasswordField from "@/shared/ui/inputs/PasswordField";
import { SignUpSchema } from "../model/schema";
import type { SignUpInput } from "../model/types";

/** Skor kekuatan password untuk UI */
function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..5
}

export function SignUpPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
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
    mode: "onChange",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const pwScore = useMemo(() => scorePassword(password), [password]);
  const pwPercent = (pwScore / 5) * 100;
  const pwColor = pwScore <= 2 ? "red" : pwScore === 3 ? "yellow" : "green";

  const onSubmit = handleSubmit(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
  });

  useEffect(() => {
    if (!isSubmitting && loading) setLoading(false);
  }, [isSubmitting, loading]);

  useEffect(() => {
    void trigger("confirmPassword");
  }, [password, trigger]);

  return (
    <AuthLayout panelWidth={520}>
      <Stack gap="md">
        <FormHeader
          title="Daftar"
          subtitle="Buat akun baru untuk melanjutkan."
        />

        <form onSubmit={onSubmit} noValidate>
          <Stack gap="sm">
            <SSOButtons />
            <Divider label="atau" my="xs" />

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
              {...register("acceptTerms")}
              checked={watch("acceptTerms")}
            />

            <Button
              type="submit"
              loading={loading || isSubmitting}
              mt="sm"
              fullWidth
              disabled={!isValid}
            >
              Buat akun
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center">
          Sudah punya akun?{" "}
          <Anchor size="sm" href="/sign-in">
            Masuk
          </Anchor>
        </Text>
      </Stack>
    </AuthLayout>
  );
}
