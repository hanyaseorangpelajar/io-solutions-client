import { z } from "zod";

export const WarrantyInfoSchema = z.object({
  purchaseDate: z.string().optional(),
  warrantyMonths: z.number().int().min(0).optional(),
  serial: z.string().optional(),
  vendor: z.string().optional(),
  invoiceNo: z.string().optional(),
});

export const RmaFormSchema = z.object({
  title: z.string().min(3),
  customerName: z.string().min(1),
  contact: z.string().optional(),
  productName: z.string().min(1),
  productSku: z.string().optional(),
  ticketId: z.string().optional(),
  issueDesc: z.string().optional(),
  warranty: WarrantyInfoSchema,
});

export type RmaFormInput = z.infer<typeof RmaFormSchema>;

export const RmaActionSchema = z.object({
  type: z.enum([
    "receive_unit",
    "send_to_vendor",
    "vendor_update",
    "replace",
    "repair",
    "return_to_customer",
    "reject",
    "cancel",
  ]),
  note: z.string().optional(),
});
export type RmaActionInput = z.infer<typeof RmaActionSchema>;
