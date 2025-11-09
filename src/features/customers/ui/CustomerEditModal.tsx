"use client";

import { useEffect } from "react";
import {
  Modal,
  Stack,
  TextInput,
  Button,
  Group,
  Textarea,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerFormSchema, type CustomerFormInput } from "../model/schema";
import type { Customer } from "../model/types";

type Props = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormInput) => Promise<void>;
  customer: Customer | null;
  isSubmitting: boolean;
};

export default function CustomerEditModal({
  opened,
  onClose,
  onSubmit,
  customer,
  isSubmitting,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CustomerFormInput>({
    resolver: zodResolver(CustomerFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (customer && opened) {
      reset({
        nama: customer.nama,
        noHp: customer.noHp,
        alamat: (customer as any).alamat || "",
        catatan: (customer as any).catatan || "",
      });
    } else if (!opened) {
      reset(); // Kosongkan form saat ditutup
    }
  }, [customer, opened, reset]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit Pelanggan: ${customer?.nama || ""}`}
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack pos="relative">
          <LoadingOverlay visible={isSubmitting} />
          <TextInput
            label="Nama Pelanggan"
            withAsterisk
            error={errors.nama?.message}
            {...register("nama")}
          />
          <TextInput
            label="Nomor HP"
            withAsterisk
            error={errors.noHp?.message}
            {...register("noHp")}
          />
          <Textarea
            label="Alamat (Opsional)"
            error={errors.alamat?.message}
            {...register("alamat")}
            minRows={3}
          />
          <Textarea
            label="Catatan (Opsional)"
            placeholder="Catatan internal..."
            error={errors.catatan?.message}
            {...register("catatan")}
            minRows={2}
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
