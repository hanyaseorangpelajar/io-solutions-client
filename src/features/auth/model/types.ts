import { z } from "zod";
import { ForgotPasswordSchema, SignInSchema, SignUpSchema } from "./schema";

export type SignInInput = z.infer<typeof SignInSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;

/**
 * Representasi data pengguna yang disimpan di client-side.
 */
export type User = {
  id: string;
  username: string;
  nama: string;
  role: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};
