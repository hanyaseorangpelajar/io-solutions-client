import { z } from "zod";

export const PartUsageSchema = z.object({
  partId: z.string().min(1),
  name: z.string().min(1),
  qty: z.number().int().min(1),
});
export const PartsArraySchema = z.array(PartUsageSchema).default([]);

export const PhotosArraySchema = z.array(z.string().min(1)).default([]);
export const TagsArraySchema = z.array(z.string().min(1)).default([]);

export const CustomCostSchema = z.object({
  label: z.string().min(1, "Nama biaya wajib"),
  amount: z.number().min(0, "Jumlah tidak boleh negatif"),
});
export const CustomCostsArraySchema = z.array(CustomCostSchema).default([]);

export const TicketResolutionSchema = z.object({
  rootCause: z.string().min(1, "Akar masalah wajib"),
  solution: z.string().min(1, "Solusi wajib"),
  parts: PartsArraySchema,
  photos: PhotosArraySchema,
  tags: TagsArraySchema,
  extraCosts: CustomCostsArraySchema,
});
export type TicketResolutionInput = z.infer<typeof TicketResolutionSchema>;
export type PartUsageInput = z.infer<typeof PartUsageSchema>;
export type CustomCostInput = z.infer<typeof CustomCostSchema>;

export const TicketFormSchema = z.object({
  subject: z.string().min(1, "Subjek wajib"),
  requester: z.string().min(1, "Pemohon wajib"),
  priority: z.enum(["low", "medium", "high", "urgent"]),

  assignee: z.string().optional().default(""),
  description: z.string().optional().default(""),
});
export type TicketFormInput = z.infer<typeof TicketFormSchema>;
