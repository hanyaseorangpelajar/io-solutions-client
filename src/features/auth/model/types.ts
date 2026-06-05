import { z } from "zod";
import { ForgotPasswordSchema, SignInSchema } from "./schema";

export type SignInInput = z.infer<typeof SignInSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export type AuthRole = "TEKNISI" | "ADMIN" | "SYSADMIN";

export interface UserDto {
  userId: string;
  username: string;
  name: string;
  role: AuthRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  user: UserDto;
  token: string;
}
