"use client";

import { useState, useEffect, FormEvent } from "react";
import { Alert, Button, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import AuthLayout from "./AuthLayout";
import FormHeader from "./FormHeader";
import { TextField, PasswordField } from "@/shared/ui";
import { useAuth } from "../AuthContext";

export function SignInForm() {
  const { login, user, isLoading: isAuthLoading } = useAuth(); // Use the login function from context
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if user is already logged in
    if (!isAuthLoading && user) {
      const params = new URLSearchParams(window.location.search);
      const redirectedFrom = params.get("redirectedFrom");
      const rolePath = (user.role || "user").toLowerCase();
      const targetPath = redirectedFrom || `/${rolePath}`;
      router.replace(targetPath);
    }
  }, [user, isAuthLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Call the login function from the context
      await login({ email, password });
      // The context will handle the redirect on success
    } catch (err: any) {
      // Extract the error message from the API response.
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
