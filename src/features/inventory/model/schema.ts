import { z } from "zod";

export const PartFormSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  sku: z.string().optional(),
  category: z.string().optional(),
  vendor: z.string().optional(),
  unit: z.string().min(1, "Wajib"),
  stock: z.number().min(0, "Tidak boleh negatif"),
  minStock: z.number().min(0, "Tidak boleh negatif").default(0),
  location: z.string().optional(),
  price: z.number().min(0, "Tidak boleh negatif").optional(),
  status: z.enum(["active", "inactive", "discontinued"]).default("active"),
});
export type PartFormInput = z.infer<typeof PartFormSchema>;

export const StockMoveSchema = z.object({
  type: z.enum(["in", "out", "adjust"]),
  qty: z.number().min(1, "Minimal 1"),
  ref: z.string().optional(),
  note: z.string().optional(),
});
export type StockMoveInput = z.infer<typeof StockMoveSchema>;
