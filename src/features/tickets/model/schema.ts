import { z } from "zod";
import { TICKET_STATUSES, TICKET_PRIORITIES } from "./types";

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
  solution: z.string().min(10, {
    message: "Solusi wajib diisi dan minimal 10 karakter.",
  }),
  notes: z.string().optional(),
  parts: PartsArraySchema,
  photos: PhotosArraySchema,
  tags: TagsArraySchema,
  extraCosts: CustomCostsArraySchema,
});
export type TicketResolutionInput = z.infer<typeof TicketResolutionSchema>;
export type PartUsageInput = z.infer<typeof PartUsageSchema>;
export type CustomCostInput = z.infer<typeof CustomCostSchema>;

export const TicketCompleteSchema = z.object({
  diagnosis: z.string().min(5, "Diagnosis wajib diisi, minimal 5 karakter."),
  solusi: z.string().min(10, "Solusi wajib diisi, minimal 10 karakter."),
  tags: z.array(z.string()).optional().default([]),
});
export type TicketCompleteInput = z.infer<typeof TicketCompleteSchema>;

const CustomerSchema = z.object({
  nama: z.string().min(1, "Nama pelanggan wajib diisi"),
  noHp: z.string().min(6, "No. HP pelanggan wajib diisi"),
});
const DeviceSchema = z.object({
  model: z.string().min(1, "Model perangkat wajib diisi"),
  brand: z.string().optional(),
  serialNumber: z.string().optional(),
});
export const TicketFormSchema = z.object({
  keluhanAwal: z.string().min(5, "Keluhan awal minimal 5 karakter"),
  customer: CustomerSchema,
  device: DeviceSchema,
  priority: z.enum(TICKET_PRIORITIES).default("medium"),
  assignee: z.string().optional().default(""),
});
export type TicketFormInput = z.infer<typeof TicketFormSchema>;

/**
 * SKEMA BARU: Untuk modal Update Status
 * Sesuai dengan serviceTicket.service.js -> updateServiceTicketStatus
 */
export const UpdateStatusSchema = z.object({
  status: z.enum(TICKET_STATUSES, {
    // <-- Enum ini sekarang sudah update
    required_error: "Status baru wajib dipilih",
  }),
  catatan: z.string().min(1, "Catatan wajib diisi untuk histori"),
});
export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;

/**
 * SKEMA BARU: Untuk modal Tambah Item
 * Sesuai dengan serviceTicket.service.js -> addReplacementItem
 */
export const AddItemSchema = z.object({
  namaKomponen: z.string().min(3, "Nama komponen wajib diisi"),
  qty: z.number().min(1, "Qty minimal 1"),
  keterangan: z.string().optional(),
});
export type AddItemInput = z.infer<typeof AddItemSchema>;
