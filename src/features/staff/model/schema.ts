import { z } from "zod";

const ROLES = ["Teknisi", "Admin", "SysAdmin"] as const;

export const StaffFormSchema = z
  .object({
    id: z.string().optional(),

    fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),

    username: z.string().min(3, "Username minimal 3 karakter"),

    password: z.string().optional(),
    confirmPassword: z.string().optional(),

    role: z.enum(ROLES, {
      required_error: "Pilih role",
    }),

    statusAktif: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (!data.id && (!data.password || data.password.length < 8)) {
        return false;
      }
      return true;
    },
    { message: "Password minimal 8 karakter", path: ["password"] }
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
    }
  );

export type StaffFormInput = z.infer<typeof StaffFormSchema>;
