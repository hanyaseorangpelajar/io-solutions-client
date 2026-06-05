"use client";

import { useState, useEffect, FormEvent } from "react";
import { Alert, Button, Stack, Box, Paper } from "@mantine/core";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthLayout from "./AuthLayout";
import FormHeader from "./FormHeader";
import { TextField, PasswordField } from "@/shared/ui";
import { useAuth } from "../AuthContext";
import logo from "../../../../public/logo.jpeg";

export function SignInForm() {
  const { login, user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ identifier, password });
    } catch (err: any) {
      const apiErrorMessage = err.response?.data?.message;
      setError(
        apiErrorMessage ||
          err.message ||
          "Gagal masuk. Periksa username & kata sandi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user && !isAuthLoading) {
      const rolePath = (user.role || "user").toLowerCase();
      router.push(`/${rolePath}`);
    }
  }, [user, isAuthLoading, router]);

  return (
    <AuthLayout
      panelWidth={420}
      brandSlot={
        <Paper radius="md" p="md" shadow="xl" withBorder>
          <Box maw={1000}>
            <Image
              src={logo}
              alt="Golden Service"
              style={{ width: "100%", height: "auto", display: "block" }}
              priority
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </Box>
        </Paper>
      }
    >
      <Stack gap="md">
        <FormHeader
          title="Masuk"
          subtitle="Gunakan username dan kata sandi anda"
        />

        {error && (
          <Alert
            color="red"
            variant="light"
            title="Login Gagal"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Stack gap="sm">
            <TextField
              label="Username"
              placeholder="Username anda"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.currentTarget.value)}
            />

            <PasswordField
              label="Kata sandi"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />

            <Button type="submit" loading={isSubmitting} mt="sm" fullWidth>
              Masuk
            </Button>
          </Stack>
        </form>
      </Stack>
    </AuthLayout>
  );
}
