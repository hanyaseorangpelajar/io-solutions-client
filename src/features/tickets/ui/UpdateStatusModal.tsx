"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, Textarea, Select } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { UpdateStatusSchema, type UpdateStatusInput } from "../model/schema";
import { TICKET_STATUSES, type TicketStatus } from "../model/types";

// Opsi status yang dapat dipilih
const statusOptions = TICKET_STATUSES.map((s) => ({ value: s, label: s }));

export default function UpdateStatusModal({
  opened,
  onClose,
  onSubmit,
  currentStatus,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateStatusInput) => Promise<void> | void;
  currentStatus: TicketStatus;
}) {
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
    control,
    register, // <-- PERBAIKAN: Tambahkan 'register' di sini
  } = useForm<UpdateStatusInput>({
    resolver: zodResolver(UpdateStatusSchema),
    mode: "onChange",
    defaultValues: {
      status: currentStatus,
      catatan: "",
    },
  });

  useEffect(() => {
    if (opened) {
      reset({ status: currentStatus, catatan: "" });
    }
  }, [opened, reset, currentStatus]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Ubah Status Tiket"
      radius="lg"
      size="md"
      centered
    >
      <form
        onSubmit={handleSubmit(async (v) => {
          await onSubmit(v);
          onClose();
        })}
        noValidate
      >
        <Stack gap="md">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Status Baru"
                data={statusOptions}
                error={errors.status?.message}
                withAsterisk
              />
            )}
          />

          <Textarea
            label="Catatan Perubahan"
            placeholder="Contoh: Menunggu sparepart datang..."
            error={errors.catatan?.message}
            withAsterisk
            minRows={3}
            {...register("catatan")}
          />

          <Group justify="end" mt="md">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isValid}>
              Simpan Perubahan
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
