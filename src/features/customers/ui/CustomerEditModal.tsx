/**
 *
 * DOKUMENTASI KOMPONEN
 * Binding properti disesuaikan dengan `CustomerDto` (name, phone, address, note).
 * Default values pada React Hook Form di-reset menggunakan properti camelCase.
 *
 */

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
import type { CustomerDto } from "../model/types";

type Props = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormInput) => Promise<void>;
  customer: CustomerDto | null;
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
        name: customer.name,
        phone: customer.phone,
        address: customer.address || "",
        note: customer.note || "",
      });
    } else if (!opened) {
      reset();
    }
  }, [customer, opened, reset]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit Pelanggan: ${customer?.name || ""}`}
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack pos="relative">
          <LoadingOverlay visible={isSubmitting} />
          <TextInput
            label="Nama Pelanggan"
            withAsterisk
            error={errors.name?.message}
            {...register("name")}
          />
          <TextInput
            label="Nomor HP"
            withAsterisk
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Textarea
            label="Alamat (Opsional)"
            error={errors.address?.message}
            {...register("address")}
            minRows={3}
          />
          <Textarea
            label="Catatan (Opsional)"
            placeholder="Catatan internal..."
            error={errors.note?.message}
            {...register("note")}
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
