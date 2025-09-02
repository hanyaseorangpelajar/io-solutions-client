"use client";

import {
  Modal,
  Stack,
  TextInput,
  Group,
  Button,
  MultiSelect,
  Switch,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StaffFormInput } from "../model/schema";
import { StaffFormSchema } from "../model/schema";
import type { Role } from "@/features/rbac/model/types";

export default function StaffFormModal({
  opened,
  onClose,
  onSubmit,
  initial,
  roles,
  title = "Tambah Staff",
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (v: StaffFormInput) => void;
  initial?: Partial<StaffFormInput>;
  roles: Role[];
  title?: string;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormInput>({
    resolver: zodResolver(StaffFormSchema),
    defaultValues: {
      name: initial?.name ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      roleIds: initial?.roleIds ?? [],
      active: initial?.active ?? true,
    },
    mode: "onChange",
  });

  const roleIds = watch("roleIds");
  const active = watch("active");

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      radius="lg"
      size="lg"
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
            label="Nama"
            withAsterisk
            error={errors.name?.message}
            {...register("name")}
          />
          <TextInput
            label="Email"
            withAsterisk
            error={errors.email?.message}
            {...register("email")}
          />
          <TextInput label="Telepon" {...register("phone")} />
          <MultiSelect
            label="Roles"
            withAsterisk
            data={roles.map((r) => ({ value: r.id, label: r.name }))}
            value={roleIds}
            onChange={(vals) =>
              setValue("roleIds", vals, { shouldValidate: true })
            }
            error={errors.roleIds?.message as any}
            searchable
            nothingFoundMessage="Role tidak tersedia"
          />
          <Switch
            label="Aktif"
            checked={active}
            onChange={(e) =>
              setValue("active", e.currentTarget.checked, {
                shouldValidate: true,
              })
            }
          />
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
