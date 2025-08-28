"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  FileInput,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  TagsInput,
  Text,
  Textarea,
} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  PartsArraySchema,
  TicketResolutionSchema,
  type TicketResolutionInput,
} from "@/features/tickets/model/schema";
import type { PartUsage } from "@/features/tickets/model/types";
import { PARTS } from "@/features/tickets/model/mock";

type Props = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (v: TicketResolutionInput) => void;
  title?: string;
  /** Nilai awal dari resolusi ticket (akan diprefill di form) */
  initial?: Partial<TicketResolutionInput>;
};

export default function AuditResolveEditorModal({
  opened,
  onClose,
  onSubmit,
  title = "Edit konten resolusi",
  initial,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TicketResolutionInput>({
    resolver: zodResolver(TicketResolutionSchema),
    mode: "onChange",
    defaultValues: {
      rootCause: initial?.rootCause ?? "",
      solution: initial?.solution ?? "",
      parts: initial?.parts ?? [],
      photos: initial?.photos ?? [],
      tags: initial?.tags ?? [],
    },
  });

  // parts selection (ids) + quantities
  const [pickedPartIds, setPickedPartIds] = useState<string[]>(
    (initial?.parts ?? []).map((p) => p.partId)
  );
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries((initial?.parts ?? []).map((p) => [p.partId, p.qty]))
  );

  // existing photos (string) + new files
  const [existingPhotos] = useState<string[]>(initial?.photos ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const newPhotoUrls = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  // part options
  const partOptions = useMemo(
    () =>
      PARTS.map((p) => ({
        value: p.id,
        label: p.name + (p.sku ? ` — ${p.sku}` : ""),
      })),
    []
  );

  // sync parts to form
  useEffect(() => {
    const parts: PartUsage[] = pickedPartIds.map((id) => {
      const p = PARTS.find((x) => x.id === id)!;
      const qty = Math.max(1, quantities[id] ?? 1);
      return { partId: id, name: p.name, qty };
    });
    PartsArraySchema.parse(parts);
    setValue("parts", parts, { shouldValidate: true });
  }, [pickedPartIds, quantities, setValue]);

  // combine existing + new photos → form.photos
  useEffect(() => {
    const all = [...existingPhotos, ...newPhotoUrls];
    setValue("photos", all, { shouldValidate: true });
    return () => {
      newPhotoUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [existingPhotos, newPhotoUrls, setValue]);

  // reset saat modal dibuka
  useEffect(() => {
    if (opened) {
      reset({
        rootCause: initial?.rootCause ?? "",
        solution: initial?.solution ?? "",
        parts: initial?.parts ?? [],
        photos: initial?.photos ?? [],
        tags: initial?.tags ?? [],
      });
      setPickedPartIds((initial?.parts ?? []).map((p) => p.partId));
      setQuantities(
        Object.fromEntries((initial?.parts ?? []).map((p) => [p.partId, p.qty]))
      );
      setFiles([]);
    }
  }, [opened, initial, reset]);

  const partRows = pickedPartIds.map((id) => {
    const p = PARTS.find((x) => x.id === id)!;
    const qty = Math.max(1, quantities[id] ?? 1);
    return (
      <Table.Tr key={id}>
        <Table.Td>{p.name}</Table.Td>
        <Table.Td>
          <NumberInput
            value={qty}
            min={1}
            onChange={(v) =>
              setQuantities((prev) => ({ ...prev, [id]: Number(v) || 1 }))
            }
            allowDecimal={false}
            clampBehavior="strict"
            w={100}
          />
        </Table.Td>
        <Table.Td>{p.unit ?? "pcs"}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      radius="lg"
      size="lg"
      centered
    >
      <form
        onSubmit={handleSubmit((v) => {
          onSubmit(v);
          onClose();
        })}
        noValidate
      >
        <Stack gap="md">
          <Textarea
            label="Akar masalah"
            placeholder="Perbaiki copy agar jelas & dapat dijadikan SOP"
            minRows={3}
            autosize
            error={errors.rootCause?.message}
            {...register("rootCause")}
          />

          <Textarea
            label="Solusi"
            placeholder="Tulis langkah-langkah ringkas, akurat, dan bisa direplikasi"
            minRows={3}
            autosize
            error={errors.solution?.message}
            {...register("solution")}
          />

          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <MultiSelect
              label="Parts dari gudang"
              placeholder="Pilih part"
              data={partOptions}
              value={pickedPartIds}
              onChange={setPickedPartIds}
              searchable
              nothingFoundMessage="Tidak ada"
            />

            <TagsInput
              label="Hashtag / Tag"
              placeholder="#hardware #SOP"
              withAsterisk
              data={[
                "hardware",
                "keyboard",
                "display",
                "network",
                "software",
                "SOP",
                "rootcause",
              ]}
              onChange={(v) => setValue("tags", v, { shouldValidate: true })}
              error={errors.tags?.message}
            />
          </SimpleGrid>

          {pickedPartIds.length > 0 && (
            <Paper withBorder radius="md" p="sm">
              <Table withRowBorders={false} highlightOnHover={false}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Part</Table.Th>
                    <Table.Th w={120}>Qty</Table.Th>
                    <Table.Th w={80}>Unit</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{partRows}</Table.Tbody>
              </Table>
            </Paper>
          )}

          <Stack gap={6}>
            <FileInput
              label="Tambah foto dokumentasi"
              placeholder="Pilih gambar (opsional)"
              multiple
              accept="image/*"
              onChange={(f) => setFiles(Array.isArray(f) ? f : f ? [f] : [])}
              error={errors.photos?.message}
            />
            {(existingPhotos.length > 0 || newPhotoUrls.length > 0) && (
              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs">
                {existingPhotos.map((u, i) => (
                  <img
                    key={`old-${i}`}
                    src={u}
                    alt={`old-${i}`}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid var(--mantine-color-gray-4)",
                    }}
                  />
                ))}
                {newPhotoUrls.map((u, i) => (
                  <img
                    key={`new-${i}`}
                    src={u}
                    alt={`new-${i}`}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid var(--mantine-color-gray-4)",
                    }}
                  />
                ))}
              </SimpleGrid>
            )}
            <Text size="xs" c="dimmed">
              Catatan: foto baru akan ditambahkan di samping foto yang sudah
              ada.
            </Text>
          </Stack>

          <Group justify="end" mt="xs">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isValid}>
              Simpan perubahan
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
