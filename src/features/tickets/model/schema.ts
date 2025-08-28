import { z } from "zod";

/* ---------- Ticket form (create/edit) ---------- */

export const TicketFormSchema = z.object({
  subject: z.string().min(3, "Minimal 3 karakter"),
  requester: z.string().min(2, "Wajib diisi"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
  assignee: z.string().optional(),
  description: z.string().optional(),
});
export type TicketFormInput = z.infer<typeof TicketFormSchema>;

/* ---------- Resolution (resolve/close) ---------- */
/** Satu item penggunaan part dari gudang */
export const PartUsageSchema = z.object({
  partId: z.string(),
  name: z.string(),
  qty: z.number().min(1, "Minimal 1"),
});

/** Array part (dipisah dari default agar bisa diberi .min() saat diperlukan) */
export const PartsArraySchema = z.array(PartUsageSchema);

/** Skema dasar resolusi tiket */
const TicketResolutionBase = z.object({
  rootCause: z.string().min(10, "Jelaskan akar masalah (≥ 10 karakter)"),
  solution: z.string().min(10, "Jelaskan solusi (≥ 10 karakter)"),
  // default: []  → boleh kosong secara umum
  parts: PartsArraySchema.default([]),
  // wajib minimal 1 foto dokumentasi
  photos: z.array(z.string()).min(1, "Minimal 1 foto dokumentasi"),
  // wajib minimal 1 tag
  tags: z.array(z.string().min(1)).min(1, "Minimal 1 tag"),
});

/** Skema standar (parts boleh kosong) */
export const TicketResolutionSchema = TicketResolutionBase;

/** Skema alternatif jika parts diwajibkan (mis. kebijakan tertentu) */
export const TicketResolutionRequirePartsSchema = TicketResolutionBase.extend({
  parts: PartsArraySchema.min(1, "Minimal 1 part"),
});

export type TicketResolutionInput = z.infer<typeof TicketResolutionSchema>;
