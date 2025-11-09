"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Stack,
  Paper,
  TextInput,
  TagsInput,
  ComboboxItem,
  Textarea,
  Button,
  Group,
  LoadingOverlay,
  FileInput,
  Image,
  Text,
  Alert,
  rem,
} from "@mantine/core";
import { IconX, IconUpload } from "@tabler/icons-react";
import { z } from "zod";
import type { KBEntryBackend, KBEntryUpdateInput } from "../api/audits";
import { useForm, zodResolver } from "@mantine/form";
import { kbSchema } from "../model/schema";
import { uploadImage } from "../api/upload";
import { notifications } from "@mantine/notifications";

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
      imageUrl: null as string | null,
    },
  });

  const [tagData, setTagData] = useState<ComboboxItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (entry) {
      form.setValues({
        gejala: entry.gejala,
        modelPerangkat: entry.modelPerangkat,
        diagnosis: entry.diagnosis,
        solusi: entry.solusi,
        tags: entry.tags ? entry.tags.map((t) => t.nama) : [],
        imageUrl: entry.imageUrl || null,
      });
      setTagData(
        entry.tags
          ? entry.tags.map((t) => ({ value: t.nama, label: t.nama }))
          : []
      );
    } else {
      form.reset();
    }
  }, [entry, opened]);

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(file);
      form.setFieldValue("imageUrl", url);
    } catch (e: any) {
      const message = e.response?.data?.message || e.message;
      setUploadError(message);
      notifications.show({
        color: "red",
        title: "Gagal Mengunggah Gambar",
        message: message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!entry) return;
    await onSubmit(values);
    onClose();
  };

  const currentImageUrl = form.values.imageUrl;

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
          <LoadingOverlay visible={isSubmitting || isUploading} />
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

          <Stack gap={4}>
            <FileInput
              label="Dokumentasi Foto (Opsional)"
              placeholder={currentImageUrl ? "Ganti foto..." : "Pilih foto..."}
              accept="image/png,image/jpeg,image/jpg"
              leftSection={<IconUpload size={rem(14)} />}
              onChange={handleFileChange}
              disabled={isUploading}
              clearable
            />
            {uploadError && (
              <Text size="xs" color="red">
                {uploadError}
              </Text>
            )}
            {currentImageUrl && (
              <Paper
                withBorder
                p="xs"
                radius="md"
                pos="relative"
                w="fit-content"
              >
                <Image
                  src={currentImageUrl}
                  alt="Preview"
                  w={200}
                  h="auto"
                  radius="sm"
                />
                <Button
                  color="red"
                  variant="light"
                  size="xs"
                  onClick={() => form.setFieldValue("imageUrl", null)}
                  style={{ position: "absolute", top: 8, right: 8 }}
                >
                  <IconX size={14} />
                </Button>
              </Paper>
            )}
          </Stack>

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
            <Button type="submit" loading={isSubmitting || isUploading}>
              Simpan Perubahan
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
