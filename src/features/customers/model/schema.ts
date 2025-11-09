import { z } from "zod";

export const CustomerFormSchema = z.object({
  nama: z.string().min(2, "Nama wajib diisi (min 2 karakter)"),
  noHp: z
    .string()
    .min(6, "No. HP wajib diisi (min 6 digit)")
    .regex(/^(08[0-9]{7,13})$/, "Format No. HP tidak valid (contoh: 0812...)"),
  alamat: z.string().optional(),
  catatan: z.string().optional(),
});

export type CustomerFormInput = z.infer<typeof CustomerFormSchema>;
