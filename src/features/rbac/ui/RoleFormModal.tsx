"use client";

import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  MultiSelect,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RoleFormInput } from "../model/schema";
import { RoleFormSchema } from "../model/schema";
import { PERMISSIONS } from "../model/mock";

export default function RoleFormModal({
  opened,
  onClose,
  onSubmit,
  initial,
  title = "Buat Role",
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (v: RoleFormInput) => void;
  initial?: Partial<RoleFormInput>;
  title?: string;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormInput>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      permissions: initial?.permissions ?? [],
    },
    mode: "onChange",
  });

  const permissions = watch("permissions");

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
            label="Nama role"
            withAsterisk
            error={errors.name?.message}
            {...register("name")}
          />
          <Textarea
            label="Deskripsi"
            autosize
            minRows={2}
            {...register("description")}
          />
          <MultiSelect
            label="Permissions"
            withAsterisk
            data={PERMISSIONS.map((p) => ({ value: p, label: p }))}
            value={permissions}
            onChange={(vals) =>
              setValue("permissions", vals, { shouldValidate: true })
            }
            error={errors.permissions?.message as any}
            searchable
            nothingFoundMessage="Tidak ada permission"
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
