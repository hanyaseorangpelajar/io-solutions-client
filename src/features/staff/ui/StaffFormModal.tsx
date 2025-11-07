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
import { useForm } from "react-hook-form";
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
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StaffFormInput>({
    resolver: zodResolver(StaffFormSchema),
    mode: "onChange",
  });
  const isNewUser = !initial?.id;

  useEffect(() => {
    if (opened) {
      const defaultValues: StaffFormInput = {
        nama: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "Teknisi",
        statusAktif: true,
      };

      reset({
        ...defaultValues,
        ...initial,
      });
    }
  }, [initial, opened, reset]);

  const role = watch("role");
  const active = watch("statusAktif");

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={title}
      centered
      radius="lg"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap="md">
          <TextInput
            label="Nama Lengkap"
            withAsterisk
            error={errors.nama?.message}
            {...register("nama")}
          />

          {isNewUser && (
            <TextInput
              label="Username"
              withAsterisk
              error={errors.username?.message}
              {...register("username")}
            />
          )}
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
          <Select
            label="Role"
            withAsterisk
            data={roles.map((r) => ({ value: r.id, label: r.name }))}
            value={role}
            onChange={(val) =>
              setValue("role", val as any, { shouldValidate: true })
            }
            error={errors.role?.message}
            searchable
            nothingFoundMessage="Role tidak tersedia"
          />
          <Switch
            label="Aktif"
            checked={active}
            onChange={(e) =>
              setValue("statusAktif", e.currentTarget.checked, {
                shouldValidate: true,
              })
            }
          />
          <Group justify="end">
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
