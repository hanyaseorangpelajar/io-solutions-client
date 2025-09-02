import { z } from "zod";
import { ForgotPasswordSchema, SignInSchema, SignUpSchema } from "./schema";

export type SignInInput = z.infer<typeof SignInSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles?: string[];
};

export type AuthResult = {
  user: AuthUser;
  token: string;
  expiresAt?: string;
  refreshToken?: string;
};
