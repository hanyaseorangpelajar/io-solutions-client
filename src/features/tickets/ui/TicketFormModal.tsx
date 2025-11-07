"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Select, Stack, Textarea } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import TextField from "@/shared/ui/inputs/TextField";
import { TicketFormSchema, type TicketFormInput } from "../model/schema";
import type { Staff } from "@/features/staff/model/types";

export default function TicketFormModal({
  opened,
  onClose,
  onSubmit,
  users,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormInput) => Promise<void> | void;
  users: Pick<Staff, "id" | "nama" | "role">[];
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
    control,
  } = useForm<TicketFormInput>({
    resolver: zodResolver(TicketFormSchema),
    mode: "onChange",
    defaultValues: {
      subject: "",
      requester: "",
      priority: "medium",
      assignee: "",
      description: "",
    },
  });

  useEffect(() => {
    if (opened) {
      reset();
    }
  }, [opened, reset]);

  const technicianOptions = useMemo(() => {
    return [
      { value: "", label: "Unassigned" }, // Opsi unassigned
      ...users
        .filter((user) => user.role === "Teknisi") // <-- LOGIKA FILTER UTAMA
        .map((user) => ({
          value: user.id,
          label: user.nama,
        })),
    ];
  }, [users]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
          </Group>

          <Controller
            name="assignee"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Teknisi (opsional)"
                placeholder="Pilih teknisi..."
                data={technicianOptions}
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
