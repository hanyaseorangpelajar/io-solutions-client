"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Anchor, Button, Divider, Stack, Text } from "@mantine/core";
import AuthLayout from "./AuthLayout";
import FormHeader from "./FormHeader";
import TextField from "@/shared/ui/inputs/TextField";
import { ForgotPasswordSchema } from "../model/schema";
import type { ForgotPasswordInput } from "../model/types";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const head = name.slice(0, 1);
  const tail = name.slice(-1);
  return `${head}${"*".repeat(Math.max(2, name.length - 2))}${tail}@${domain}`;
}

export function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setSentTo(values.email);
    setCooldown(30);
    setLoading(false);
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const masked = useMemo(() => (sentTo ? maskEmail(sentTo) : ""), [sentTo]);

  return (
    <AuthLayout panelWidth={420}>
      <Stack gap="md">
        {!sentTo ? (
          <>
            <FormHeader
              title="Lupa kata sandi"
              subtitle="Masukkan email untuk menerima tautan reset."
            />

            <form onSubmit={onSubmit} noValidate>
              <Stack gap="sm">
                <TextField
                  label="Email"
                  placeholder="you@domain.com"
                  autoComplete="email"
                  autoFocus
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Button
                  type="submit"
                  loading={loading || isSubmitting}
                  mt="sm"
                  fullWidth
                  disabled={!isValid}
                >
                  Kirim tautan reset
                </Button>
              </Stack>
            </form>

            <Divider my="xs" />
            <Text size="sm" ta="center">
              Ingat kata sandi?{" "}
              <Anchor size="sm" href="/sign-in">
                Kembali ke Masuk
              </Anchor>
            </Text>
          </>
        ) : (
          <>
            <FormHeader title="Cek email kamu" />
            <Text c="dimmed" size="sm">
              Kami mengirim tautan reset ke <strong>{masked}</strong>. Jika
              tidak terlihat, periksa folder Spam/Promotions.
            </Text>

            <Stack gap="xs">
              <Button
                variant="default"
                onClick={() => setCooldown(30)}
                disabled={cooldown > 0}
              >
                {cooldown > 0
                  ? `Kirim ulang dalam ${cooldown}s`
                  : "Kirim ulang email"}
              </Button>

              <Button
                variant="light"
                onClick={() => {
                  const v = getValues("email");
                  setSentTo(null);
                  void v;
                }}
              >
                Gunakan email lain
              </Button>

              <Button component="a" href="/sign-in" variant="subtle">
                Kembali ke Masuk
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </AuthLayout>
  );
}
