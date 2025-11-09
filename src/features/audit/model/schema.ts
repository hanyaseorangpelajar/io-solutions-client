import { z } from "zod";

export const AuditFormSchema = z.object({
  score: z.number().min(0).max(100),
  tags: z.array(z.string().min(1)).min(1, "Minimal 1 tag"),
  notes: z.string().optional(),
});
export type AuditFormInput = z.infer<typeof AuditFormSchema>;

export const kbSchema = z.object({
  gejala: z.string().min(5, "Gejala wajib diisi (min 5 karakter)"),
  modelPerangkat: z
    .string()
    .min(3, "Model perangkat wajib diisi (min 3 karakter)"),
  diagnosis: z.string().min(5, "Diagnosis wajib diisi (min 5 karakter)"),
  solusi: z.string().min(10, "Solusi wajib diisi (min 10 karakter)"),
  tags: z.array(z.string()).optional().default([]),
  imageUrl: z.string().url().nullable().optional(),
});
