"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import AuthLayout from "./AuthLayout";
import FormHeader from "./FormHeader";
import SSOButtons from "./SSOButtons";
import TextField from "@/shared/ui/inputs/TextField";
import PasswordField from "@/shared/ui/inputs/PasswordField";
import { SignInSchema } from "../model/schema";
import type { SignInInput } from "../model/types";

export function SignInPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { identifier: "", password: "", remember: false },
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
  });

  useEffect(() => {
    if (!isSubmitting && loading) setLoading(false);
  }, [isSubmitting, loading]);

  return (
    <AuthLayout panelWidth={420}>
      <Stack gap="md">
        <FormHeader title="Masuk" subtitle="Gunakan email atau username" />

        <form onSubmit={onSubmit} noValidate>
          <Stack gap="sm">
            <SSOButtons />
            <Divider label="atau" my="xs" />

            <TextField
              label="Email / Username"
              placeholder="you@domain.com atau johndoe"
              autoComplete="username"
              autoFocus
              error={errors.identifier?.message}
              {...register("identifier")}
            />

            <PasswordField
              label="Kata sandi"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              showCapsLockHint
              {...register("password")}
            />

            <Group justify="space-between" mt="xs">
              <Checkbox
                label="Ingat saya"
                {...register("remember")}
                checked={watch("remember")}
              />
              <Anchor size="sm" href="/forgot-password">
                Lupa kata sandi?
              </Anchor>
            </Group>

            <Button
              type="submit"
              loading={loading || isSubmitting}
              mt="sm"
              fullWidth
              disabled={!isValid}
            >
              Masuk
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center">
          Belum punya akun?{" "}
          <Anchor size="sm" href="/sign-up">
            Daftar
          </Anchor>
        </Text>
      </Stack>
    </AuthLayout>
  );
}
