import { z } from "zod";
import { ROLES } from "./types";

export const StaffFormSchema = z
  .object({
    userId: z.string().optional(),
    name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    role: z.enum(ROLES, {
      required_error: "Pilih role",
    }),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (!data.userId && (!data.password || data.password.length < 8)) {
        return false;
      }
      return true;
    },
    { message: "Password minimal 8 karakter", path: ["password"] },
  )
  .refine(
    (data) => {
      if (data.password) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Password tidak cocok",
      path: ["confirmPassword"],
    },
  );

export type StaffFormInput = z.infer<typeof StaffFormSchema>;
