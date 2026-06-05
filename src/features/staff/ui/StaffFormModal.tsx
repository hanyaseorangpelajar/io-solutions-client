"use client";

import {
  Modal,
  Stack,
  TextInput,
  Group,
  Button,
  Select,
  Switch,
  PasswordInput,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StaffFormInput } from "../model/schema";
import { StaffFormSchema } from "../model/schema";

type Role = { id: string; name: string };

export default function StaffFormModal({
  opened,
  onClose,
  onSubmit,
  initial,
  roles,
  title = "Tambah Staff",
  isSubmitting,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (v: StaffFormInput) => Promise<void>;
  initial?: Partial<StaffFormInput>;
  roles: Role[];
  title?: string;
  isSubmitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StaffFormInput>({
    resolver: zodResolver(StaffFormSchema),
    mode: "onChange",
  });

  const isNewUser = !initial?.userId;

  useEffect(() => {
    if (opened) {
      reset({
        userId: initial?.userId,
        name: initial?.name || "",
        username: initial?.username || "",
        role: initial?.role || "TEKNISI",
        isActive: initial?.isActive ?? true,
      });
    }
  }, [opened, initial, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={title} centered>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Nama Lengkap"
            withAsterisk
            error={errors.name?.message}
            {...register("name")}
          />
          <TextInput
            label="Username"
            withAsterisk
            error={errors.username?.message}
            {...register("username")}
            disabled={!isNewUser} // Biasanya username tidak bisa diubah setelah dibuat
          />
          {isNewUser && (
            <>
              <PasswordInput
                label="Password"
                withAsterisk
                error={errors.password?.message}
                {...register("password")}
              />
              <PasswordInput
                label="Konfirmasi Password"
                withAsterisk
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </>
          )}

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Role"
                withAsterisk
                data={roles.map((r) => ({ value: r.id, label: r.name }))}
                error={errors.role?.message}
                searchable
                nothingFoundMessage="Role tidak tersedia"
              />
            )}
          />

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                label="Aktif"
                checked={field.value}
                onChange={(event) =>
                  field.onChange(event.currentTarget.checked)
                }
                mt="xs"
              />
            )}
          />

          <Group justify="end" mt="md">
            <Button variant="default" onClick={handleClose}>
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
