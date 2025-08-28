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
  TicketResolutionSchema,
  TicketResolutionRequirePartsSchema,
  PartsArraySchema,
  type TicketResolutionInput,
} from "../model/schema";
import type { PartUsage } from "../model/types";
import { PARTS } from "../model/mock";

type ResolveTicketModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: TicketResolutionInput) => Promise<void> | void;
  assignee?: string; // teknisi aktif (prefill resolvedBy di caller)
  title?: string; // judul modal (single/bulk)
  requireParts?: boolean; // jika parts wajib diisi
};

export default function ResolveTicketModal({
  opened,
  onClose,
  onSubmit,
  assignee,
  title = "Tandai tiket selesai",
  requireParts = false,
}: ResolveTicketModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TicketResolutionInput>({
    resolver: zodResolver(
      requireParts ? TicketResolutionRequirePartsSchema : TicketResolutionSchema
    ),
    mode: "onChange",
    defaultValues: {
      rootCause: "",
      solution: "",
      parts: [],
      photos: [],
      tags: [],
    },
  });

  // parts selection (ids) + quantities
  const [pickedPartIds, setPickedPartIds] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // photos preview via Object URL
  const [files, setFiles] = useState<File[]>([]);
  const photoUrls = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  // options for parts
  const partOptions = useMemo(
    () =>
      PARTS.map((p) => ({
        value: p.id,
        label: p.name + (p.sku ? ` — ${p.sku}` : ""),
      })),
    []
  );

  // sinkronkan parts ke form setiap kali pilihan/qty berubah
  useEffect(() => {
    const parts: PartUsage[] = pickedPartIds.map((id) => {
      const p = PARTS.find((x) => x.id === id)!;
      const qty = Math.max(1, quantities[id] ?? 1);
      return { partId: id, name: p.name, qty };
    });
    // gunakan schema array asli agar konsisten tipenya
    PartsArraySchema.parse(parts); // optional: guard runtime saat dev
    setValue("parts", parts, { shouldValidate: true });
  }, [pickedPartIds, quantities, setValue]);

  // set photos string[] dari object URLs untuk validasi min(1)
  useEffect(() => {
    setValue("photos", photoUrls, { shouldValidate: true });
    return () => {
      photoUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [photoUrls, setValue]);

  // reset saat modal ditutup
  useEffect(() => {
    if (!opened) {
      reset();
      setPickedPartIds([]);
      setQuantities({});
      setFiles([]);
    }
  }, [opened, reset]);

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
        onSubmit={handleSubmit(async (v) => {
          await onSubmit(v);
          onClose();
        })}
        noValidate
      >
        <Stack gap="md">
          <Textarea
            label="Akar masalah"
            placeholder="Contoh: Kabel pita keyboard putus sehingga tombol tidak terdeteksi."
            minRows={3}
            autosize
            error={errors.rootCause?.message}
            {...register("rootCause")}
          />

          <Textarea
            label="Solusi"
            placeholder="Contoh: Ganti kabel pita, uji semua tombol, update driver."
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
              placeholder="#hardware #keyboard"
              data={[
                "hardware",
                "keyboard",
                "display",
                "network",
                "software",
                "urgent",
                "sla",
              ]}
              withAsterisk
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
              label="Foto dokumentasi"
              placeholder="Pilih gambar (bisa lebih dari satu)"
              multiple
              accept="image/*"
              onChange={(f) => setFiles(Array.isArray(f) ? f : f ? [f] : [])}
              error={errors.photos?.message}
              withAsterisk
            />
            {photoUrls.length > 0 && (
              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs">
                {photoUrls.map((u, i) => (
                  <img
                    key={i}
                    src={u}
                    alt={`doc-${i + 1}`}
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
              Minimal 1 foto. (UI-only)
            </Text>
          </Stack>

          <Group justify="end" mt="xs">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isValid}>
              Tandai Selesai
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
