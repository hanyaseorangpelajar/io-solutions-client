"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Group,
  Modal,
  Stack,
  Textarea,
  ActionIcon,
  Select,
  NumberInput,
  Text,
  SimpleGrid,
} from "@mantine/core";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { PartsArraySchema } from "../model/schema";
import { IconPlus, IconTrash } from "@tabler/icons-react";

type InventoryPart = {
  id: string;
  name: string;
  stock: number;
};

const ActionSchema = z.object({
  actionTaken: z.string().min(1, "Tindakan yang diambil wajib diisi"),
  partsUsed: PartsArraySchema,
});

type ActionFormInput = z.infer<typeof ActionSchema>;

export default function AddActionModal({
  opened,
  onClose,
  onSubmit,
  inventoryParts,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: ActionFormInput) => Promise<void> | void;
  inventoryParts: InventoryPart[];
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue, // <-- PERBAIKAN: Ekstrak setValue di sini
    formState: { errors, isSubmitting, isValid },
  } = useForm<ActionFormInput>({
    resolver: zodResolver(ActionSchema),
    mode: "onChange",
    defaultValues: {
      actionTaken: "",
      partsUsed: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "partsUsed",
  });

  const partOptions = inventoryParts.map((p) => ({
    value: p.id,
    label: `${p.name} (Stok: ${p.stock})`,
  }));

  useEffect(() => {
    if (opened) {
      reset();
    }
  }, [opened, reset]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Tambah Tindakan Teknisi"
      radius="lg"
      size="xl"
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
          <Textarea
            label="Tindakan yang Diambil"
            placeholder="Jelaskan tindakan perbaikan atau maintenance yang dilakukan..."
            error={errors.actionTaken?.message}
            withAsterisk
            minRows={3}
            {...register("actionTaken")}
          />

          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>Suku Cadang Digunakan</Text>
              <Button
                size="xs"
                variant="outline"
                leftSection={<IconPlus size={14} />}
                onClick={() => append({ partId: "", name: "", qty: 1 })}
              >
                Tambah Part
              </Button>
            </Group>

            {fields.length === 0 && (
              <Text c="dimmed" size="sm" ta="center" py="md">
                Tidak ada suku cadang yang ditambahkan.
              </Text>
            )}

            <Stack gap="xs">
              {fields.map((field, index) => (
                <SimpleGrid
                  key={field.id}
                  cols={3}
                  spacing="sm"
                  style={{ alignItems: "flex-start" }}
                >
                  <Controller
                    name={`partsUsed.${index}.partId`}
                    control={control}
                    render={({ field: selectField }) => (
                      <Select
                        {...selectField}
                        label={index === 0 ? "Suku Cadang" : undefined}
                        data={partOptions}
                        placeholder="Pilih part..."
                        withAsterisk
                        searchable
                        onChange={(value) => {
                          const selectedPart = inventoryParts.find(
                            (p) => p.id === value
                          );
                          selectField.onChange(value);
                          // PERBAIKAN: Panggil setValue() langsung
                          setValue(
                            `partsUsed.${index}.name`,
                            selectedPart?.name ?? ""
                          );
                        }}
                      />
                    )}
                  />

                  <Controller
                    name={`partsUsed.${index}.qty`}
                    control={control}
                    render={({ field: numField }) => (
                      <NumberInput
                        {...numField}
                        label={index === 0 ? "Qty" : undefined}
                        min={1}
                        withAsterisk
                        allowDecimal={false}
                      />
                    )}
                  />

                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => remove(index)}
                    style={{ marginTop: index === 0 ? 25 : 0 }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </SimpleGrid>
              ))}
            </Stack>
            {errors.partsUsed && (
              <Text c="red" size="xs">
                {errors.partsUsed.message}
              </Text>
            )}
          </Stack>

          <Group justify="end" mt="md">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isValid}>
              Simpan Tindakan
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
