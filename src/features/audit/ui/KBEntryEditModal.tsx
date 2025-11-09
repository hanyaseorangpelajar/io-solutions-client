"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Stack,
  TextInput,
  TagsInput,
  ComboboxItem,
  Textarea,
  Button,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { z } from "zod";
import type { KBEntryBackend, KBEntryUpdateInput } from "../api/audits";
import { useForm, zodResolver } from "@mantine/form";

const kbSchema = z.object({
  gejala: z.string().min(5, "Gejala wajib diisi (min 5 karakter)"),
  modelPerangkat: z
    .string()
    .min(3, "Model perangkat wajib diisi (min 3 karakter)"),
  diagnosis: z.string().min(5, "Diagnosis wajib diisi (min 5 karakter)"),
  solusi: z.string().min(10, "Solusi wajib diisi (min 10 karakter)"),
  tags: z.array(z.string()).optional().default([]),
});

type Props = {
  opened: boolean;
  onClose: () => void;
  entry: KBEntryBackend | null;
  onSubmit: (data: KBEntryUpdateInput) => Promise<void>;
  isSubmitting: boolean;
};

export default function KBEntryEditModal({
  opened,
  onClose,
  entry,
  onSubmit,
  isSubmitting,
}: Props) {
  const form = useForm({
    validate: zodResolver(kbSchema),
    initialValues: {
      gejala: "",
      modelPerangkat: "",
      diagnosis: "",
      solusi: "",
      tags: [] as string[],
    },
  });

  const [tagData, setTagData] = useState<ComboboxItem[]>([]);

  useEffect(() => {
    if (entry) {
      form.setValues({
        gejala: entry.gejala,
        modelPerangkat: entry.modelPerangkat,
        diagnosis: entry.diagnosis,
        solusi: entry.solusi,
        tags: entry.tags ? entry.tags.map((t) => t.nama) : [],
      });
      setTagData(
        entry.tags
          ? entry.tags.map((t) => ({ value: t.nama, label: t.nama }))
          : []
      );
    } else {
      form.reset();
    }
  }, [entry]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!entry) return;
    await onSubmit(values);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Entri Knowledge Base"
      size="lg"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack pos="relative" gap="sm">
          <LoadingOverlay visible={isSubmitting} />
          <TextInput
            label="Gejala (Keluhan Awal)"
            withAsterisk
            {...form.getInputProps("gejala")}
          />
          <TextInput
            label="Model Perangkat"
            withAsterisk
            {...form.getInputProps("modelPerangkat")}
          />
          <Textarea
            label="Diagnosis"
            minRows={3}
            withAsterisk
            {...form.getInputProps("diagnosis")}
          />
          <Textarea
            label="Solusi"
            minRows={4}
            withAsterisk
            {...form.getInputProps("solusi")}
          />

          <TagsInput
            label="Tags (Label)"
            placeholder="Ketik tag lalu tekan Enter..."
            data={tagData}
            clearable
            {...form.getInputProps("tags")}
          />

          <Group justify="end" mt="md">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Simpan Perubahan
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
