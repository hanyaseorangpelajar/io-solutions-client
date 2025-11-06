import { z } from "zod";
import { ForgotPasswordSchema, SignInSchema, SignUpSchema } from "./schema";

export type SignInInput = z.infer<typeof SignInSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;

/**
 * Representasi data pengguna yang disimpan di client-side.
 */
export type User = {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  email: string;
  updatedAt?: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};
