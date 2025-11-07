import { z } from "zod";
import { ForgotPasswordSchema, SignInSchema, SignUpSchema } from "./schema";

export type SignInInput = z.infer<typeof SignInSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;

/**
 * Representasi data pengguna yang disimpan di client-side.
 * Disesuaikan agar cocok dengan 'user.model.js' dari backend.
 */
export type User = {
  id: string;
  username: string;
  nama: string;
  role: string;
  statusAktif?: boolean;
  dibuatPada?: string;
  diperbaruiPada?: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};
