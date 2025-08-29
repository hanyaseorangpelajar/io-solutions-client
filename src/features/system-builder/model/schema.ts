import { z } from "zod";
import type { ComponentCategory } from "./types";

// Jenis sistem fleksibel (string apa pun, mis. "desktop", "server", "iot", dst)
export const BuildIdSchema = z.string();
export type BuildIdInput = z.infer<typeof BuildIdSchema>;

// Sumber item
export const SourceTypeSchema = z.enum(["store", "market"]);
export type SourceTypeInput = z.infer<typeof SourceTypeSchema>;

// Pilihan komponen
export const BuilderPickSchema = z.object({
  source: SourceTypeSchema,
  itemId: z.string().nullable(), // boleh kosong
});
export type BuilderPickInput = z.infer<typeof BuilderPickSchema>;

// Koleksi pilihan per kategori komponen
export const BuilderSelectionSchema = z.record(
  z.custom<ComponentCategory>(),
  BuilderPickSchema
);
// Catatan: infer di bawah akan jadi Record<string, BuilderPickInput>
export type BuilderSelectionInput = z.infer<typeof BuilderSelectionSchema>;
