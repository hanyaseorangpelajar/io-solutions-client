"use client";

import { Modal, Stack, Select, Textarea, Group, Button } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RmaActionSchema, type RmaActionInput } from "../model/schema";

const ACTIONS = [
  { value: "receive_unit", label: "Terima unit" },
  { value: "send_to_vendor", label: "Kirim ke vendor" },
  { value: "vendor_update", label: "Update dari vendor" },
  { value: "replace", label: "Diganti" },
  { value: "repair", label: "Diperbaiki" },
  { value: "return_to_customer", label: "Kembalikan ke pelanggan" },
  { value: "reject", label: "Ditolak vendor" },
  { value: "cancel", label: "Batalkan RMA" },
];

export default function RmaActionModal({
  opened,
  onClose,
  onSubmit,
  initialType,
  title = "Catat aksi RMA",
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (v: RmaActionInput) => void;
  initialType?: string;
  title?: string;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid, errors },
  } = useForm<RmaActionInput>({
    resolver: zodResolver(RmaActionSchema),
    mode: "onChange",
    defaultValues: {
      type: (initialType as RmaActionInput["type"]) ?? "receive_unit",
      note: "",
    },
  });

  return (
    <Modal opened={opened} onClose={onClose} title={title} radius="lg" centered>
      <form
        onSubmit={handleSubmit((v) => {
          onSubmit(v);
          onClose();
        })}
        noValidate
      >
        <Stack gap="md">
          <Select
            label="Jenis aksi"
            data={ACTIONS}
            value={undefined} // biar controlled oleh RHF via register
            onChange={(v) =>
              setValue("type", (v as any) ?? "receive_unit", {
                shouldValidate: true,
              })
            }
            defaultValue={initialType}
            error={errors.type?.message as any}
          />
          <Textarea
            label="Catatan"
            autosize
            minRows={3}
            {...register("note")}
          />

          <Group justify="end">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={!isValid} loading={isSubmitting}>
              Simpan
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
