import { z } from "zod";

/** Identifier: email ATAU username (untuk Sign-in) */
export const IdentifierSchema = z
  .string()
  .min(1, "Wajib diisi")
  .refine(
    (v) => {
      if (v.includes("@")) {
        return /^\S+@\S+\.\S+$/.test(v);
      }
      return v.length >= 3;
    },
    { message: "Gunakan email valid atau username (≥ 3 karakter)" }
  );

export const SignInSchema = z.object({
  identifier: IdentifierSchema,
  password: z.string().min(6, "Minimal 6 karakter"),
  remember: z.boolean().optional().default(false),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, "Wajib diisi").email("Email tidak valid"),
});

/** Sign-up */
export const SignUpSchema = z
  .object({
    name: z.string().min(2, "Minimal 2 karakter"),
    username: z.string().min(3, "Username minimal 3 karakter"),
    email: z.string().min(1, "Wajib diisi").email("Email tidak valid"),
    password: z.string().min(8, "Minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Wajib diisi"),
    // Penting: gunakan boolean + refine (bukan z.literal(true))
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "Kamu harus menyetujui Syarat & Ketentuan",
    }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });
