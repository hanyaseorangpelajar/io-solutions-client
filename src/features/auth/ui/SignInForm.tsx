"use client";

import { useState, useEffect, FormEvent } from "react";
import { Alert, Button, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import AuthLayout from "./AuthLayout";
import FormHeader from "./FormHeader";
import { TextField, PasswordField } from "@/shared/ui";
import { useAuth } from "../AuthContext";

export function SignInForm() {
  const { login, user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
    } catch (err: any) {
      const apiErrorMessage = err.response?.data?.message;
      setError(
        apiErrorMessage ||
          err.message ||
          "Gagal masuk. Periksa username/email & kata sandi."
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
    <AuthLayout panelWidth={420}>
      <Stack gap="md">
        <FormHeader
          title="Masuk"
          subtitle="Gunakan username atau email dan kata sandi"
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
              label="Username atau Email"
              placeholder="username atau you@domain.com"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
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
