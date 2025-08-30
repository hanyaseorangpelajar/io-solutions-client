"use client";

import {
  Modal,
  Stack,
  TextInput,
  Group,
  Button,
  Textarea,
  SimpleGrid,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RmaFormSchema, type RmaFormInput } from "../model/schema";

export default function RmaFormModal({
  opened,
  onClose,
  onSubmit,
  initial,
  title = "Buat RMA",
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (v: RmaFormInput) => void;
  initial?: Partial<RmaFormInput>;
  title?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RmaFormInput>({
    resolver: zodResolver(RmaFormSchema),
    defaultValues: {
      title: initial?.title ?? "",
      customerName: initial?.customerName ?? "",
      contact: initial?.contact ?? "",
      productName: initial?.productName ?? "",
      productSku: initial?.productSku ?? "",
      ticketId: initial?.ticketId ?? "",
      issueDesc: initial?.issueDesc ?? "",
      warranty: {
        purchaseDate: initial?.warranty?.purchaseDate ?? "",
        warrantyMonths: initial?.warranty?.warrantyMonths ?? 12,
        serial: initial?.warranty?.serial ?? "",
        vendor: initial?.warranty?.vendor ?? "",
        invoiceNo: initial?.warranty?.invoiceNo ?? "",
      },
    },
    mode: "onChange",
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      radius="lg"
      size="lg"
      centered
    >
      <form
        onSubmit={handleSubmit((v) => {
          onSubmit(v);
          onClose();
        })}
        noValidate
      >
        <Stack gap="md">
          <TextInput
            label="Judul"
            withAsterisk
            error={errors.title?.message}
            {...register("title")}
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label="Nama pelanggan"
              withAsterisk
              error={errors.customerName?.message}
              {...register("customerName")}
            />
            <TextInput
              label="Kontak"
              placeholder="Telp/Email"
              {...register("contact")}
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label="Produk"
              withAsterisk
              error={errors.productName?.message}
              {...register("productName")}
            />
            <TextInput label="SKU" {...register("productSku")} />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label="No. tiket (opsional)"
              placeholder="Jika berasal dari tiket"
              {...register("ticketId")}
            />
            <TextInput label="Serial number" {...register("warranty.serial")} />
          </SimpleGrid>

          <Textarea
            label="Deskripsi masalah"
            autosize
            minRows={3}
            {...register("issueDesc")}
          />

          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <TextInput
              label="Tanggal pembelian (ISO)"
              placeholder="2025-08-01T00:00:00.000Z"
              {...register("warranty.purchaseDate")}
            />
            <TextInput
              label="Durasi garansi (bulan)"
              type="number"
              {...register("warranty.warrantyMonths", { valueAsNumber: true })}
            />
            <TextInput label="Vendor" {...register("warranty.vendor")} />
          </SimpleGrid>

          <TextInput label="No. Invoice" {...register("warranty.invoiceNo")} />

          <Group justify="end">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Simpan
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
