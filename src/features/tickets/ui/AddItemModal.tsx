"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Group,
  Modal,
  Stack,
  Textarea,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { AddItemSchema, type AddItemInput } from "../model/schema";

export default function AddItemModal({
  opened,
  onClose,
  onSubmit,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: AddItemInput) => Promise<void> | void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
    control,
  } = useForm<AddItemInput>({
    resolver: zodResolver(AddItemSchema),
    mode: "onChange",
    defaultValues: {
      componentName: "",
      quantity: 1,
      note: "",
    },
  });

  useEffect(() => {
    if (opened) {
      reset({ componentName: "", quantity: 1, note: "" });
    }
  }, [opened, reset]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Tambah Item Pengganti"
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
          <TextInput
            label="Nama Komponen"
            placeholder="Mis: RAM DDR4 8GB"
            error={errors.componentName?.message}
            withAsterisk
            {...register("componentName")}
          />

          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Kuantitas"
                min={1}
                step={1}
                allowDecimal={false}
                error={errors.quantity?.message}
                withAsterisk
              />
            )}
          />

          <Textarea
            label="Keterangan (Opsional)"
            placeholder="Mis: Original, Copotan, dll."
            minRows={2}
            {...register("note")}
          />

          <Group justify="end" mt="md">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isValid}>
              Simpan Item
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
