"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Select, Stack, Textarea } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import TextField from "@/shared/ui/inputs/TextField";
import { TicketFormSchema, type TicketFormInput } from "../model/schema";
// Kita perlu tipe data User (Staff) untuk props
import type { Staff } from "@/features/staff/model/types";

export default function TicketFormModal({
  opened,
  onClose,
  onSubmit,
  // PERBAIKAN: Tambahkan prop 'users' untuk mengisi <Select> Teknisi
  users,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormInput) => Promise<void> | void;
  // PERBAIKAN: Hapus 'initial' dan 'mode'
  users: Pick<Staff, "id" | "name">[]; // Terima daftar user (Teknisi)
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
    // PERBAIKAN: Kita butuh 'control' untuk Mantine Select
    control,
  } = useForm<TicketFormInput>({
    resolver: zodResolver(TicketFormSchema),
    mode: "onChange",
    defaultValues: {
      subject: "",
      requester: "",
      priority: "medium",
      // PERBAIKAN: Hapus 'status'
      assignee: "",
      description: "",
    },
  });

  // PERBAIKAN: Hapus logic 'useEffect' yang menggunakan 'initial'
  // Cukup reset form saat dibuka
  useEffect(() => {
    if (opened) {
      reset(); // Reset ke defaultValues
    }
  }, [opened, reset]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      // PERBAIKAN: Judul 'Create Only'
      title="Buat Ticket Baru"
      radius="lg"
      size="lg"
      centered
    >
      <form
        onSubmit={handleSubmit(async (v) => {
          await onSubmit(v);
          onClose();
        })}
        noValidate
      >
        <Stack gap="sm">
          <TextField
            label="Subjek"
            placeholder="Masalah yang ingin dilaporkan"
            error={errors.subject?.message}
            autoFocus
            {...register("subject")}
          />

          <TextField
            label="Pemohon"
            placeholder="Nama pemohon"
            error={errors.requester?.message}
            {...register("requester")}
          />

          <Group grow>
            {/* PERBAIKAN: Gunakan 'Controller' untuk Mantine Select */}
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Prioritas"
                  data={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                    { value: "urgent", label: "Urgent" },
                  ]}
                  error={errors.priority?.message}
                />
              )}
            />

            {/* PERBAIKAN: Hapus <Select> untuk Status */}
          </Group>

          {/* PERBAIKAN: Ganti TextField Teknisi dengan Select */}
          <Controller
            name="assignee"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Teknisi (opsional)"
                placeholder="Pilih teknisi..."
                data={[
                  // Tambahkan opsi "Unassigned"
                  { value: "", label: "Unassigned" },
                  // Map dari props 'users'
                  ...users.map((user) => ({
                    value: user.id,
                    label: user.name,
                  })),
                ]}
                error={errors.assignee?.message}
                searchable
                clearable
              />
            )}
          />

          <Textarea
            label="Deskripsi"
            minRows={3}
            autosize
            {...register("description")}
          />

          <Group justify="end" mt="xs">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isValid}>
              Buat Tiket
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
