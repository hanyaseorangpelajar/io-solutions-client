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
    { message: "Gunakan username (≥ 3 karakter)" }
  );

export const SignInSchema = z.object({
  identifier: IdentifierSchema,
  password: z.string().min(6, "Minimal 6 karakter"),
  remember: z.boolean().optional().default(false),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, "Wajib diisi").email("Email tidak valid"),
});
