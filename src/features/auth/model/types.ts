import { z } from "zod";
import { ForgotPasswordSchema, SignInSchema, SignUpSchema } from "./schema";

// --- Tipe Input Form ---
export type SignInInput = z.infer<typeof SignInSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;

// --- Tipe Data Model & API ---

/**
 * Representasi data pengguna yang disimpan di client-side.
 */
export type User = {
  _id: string;
  username: string;
  fullName: string;
  role: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};
