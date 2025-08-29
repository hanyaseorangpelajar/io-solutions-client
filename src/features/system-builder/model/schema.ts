import { z } from "zod";
import type { BuildType, ComponentCategory, SourceType } from "./types";

export const BuildTypeSchema = z.enum(["desktop", "server", "iot"]);
export const SourceTypeSchema = z.enum(["store", "market"]);

export const BuilderPickSchema = z.object({
  source: SourceTypeSchema,
  itemId: z.string().nullable(),
});

export const BuilderSelectionSchema = z.record(
  z.custom<ComponentCategory>(),
  BuilderPickSchema
);

export type BuildTypeInput = z.infer<typeof BuildTypeSchema>;
export type BuilderPickInput = z.infer<typeof BuilderPickSchema>;
