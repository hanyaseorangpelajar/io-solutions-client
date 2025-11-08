"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Textarea,
  SimpleGrid,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import TextField from "@/shared/ui/inputs/TextField";
import { TicketFormSchema, type TicketFormInput } from "../model/schema";
import type { Staff } from "@/features/staff";

export default function TicketFormModal({
  opened,
  onClose,
  onSubmit,
  users,
  defaultAssigneeId,
  userRole,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormInput) => Promise<void> | void;
  users: Pick<Staff, "id" | "nama" | "role">[];
  defaultAssigneeId?: string;
  userRole?: string;
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
  });

  const isTechnician = userRole === "Teknisi";

  useEffect(() => {
    if (opened) {
      reset({
        keluhanAwal: "",
        customer: {
          nama: "",
          noHp: "",
        },
        device: {
          model: "",
          brand: "",
          serialNumber: "",
        },
        priority: "medium",
        assignee: defaultAssigneeId ?? "",
      });
    }
  }, [opened, reset, defaultAssigneeId]);

  const technicianOptions = useMemo(() => {
    return [
      { value: "", label: "Unassigned" },
      ...users
        .filter((user) => user.role === "Teknisi")
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
          <Textarea
            label="Keluhan Awal"
            placeholder="Jelaskan keluhan pelanggan atau masalah perangkat"
            error={errors.keluhanAwal?.message}
            autoFocus
            withAsterisk
            minRows={3}
            {...register("keluhanAwal")}
          />

          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextField
              label="Nama Pelanggan"
              placeholder="Nama pelanggan"
              error={errors.customer?.nama?.message}
              withAsterisk
              {...register("customer.nama")}
            />
            <TextField
              label="No. HP Pelanggan"
              placeholder="0812..."
              error={errors.customer?.noHp?.message}
              withAsterisk
              {...register("customer.noHp")}
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <TextField
              label="Model Perangkat"
              placeholder="Mis: Laptop, Printer, PC"
              error={errors.device?.model?.message}
              withAsterisk
              {...register("device.model")}
            />
            <TextField
              label="Brand (Opsional)"
              placeholder="Mis: HP, Asus, Canon"
              error={errors.device?.brand?.message}
              {...register("device.brand")}
            />
            <TextField
              label="Serial No. (Opsional)"
              placeholder="S/N jika ada"
              error={errors.device?.serialNumber?.message}
              {...register("device.serialNumber")}
            />
          </SimpleGrid>

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
            <Controller
              name="assignee"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={isTechnician ? "Ditugaskan Ke" : "Teknisi (opsional)"}
                  placeholder="Pilih teknisi..."
                  data={technicianOptions}
                  error={errors.assignee?.message}
                  searchable
                  clearable={!isTechnician}
                  readOnly={isTechnician}
                />
              )}
            />
          </Group>

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
