"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PartUsage } from "@/features/tickets/model/types";
import { useQuery } from "@tanstack/react-query";
import { listParts, type Part } from "@/features/inventory/api/parts";
import {
  ActionIcon,
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
  Tooltip,
  rem,
} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  PartsArraySchema,
  TicketResolutionSchema,
  type TicketResolutionInput,
} from "@/features/tickets/model/schema";
import {
  IconArrowLeft,
  IconArrowRight,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

type Props = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (v: TicketResolutionInput) => void;
  title?: string;
  /** Prefill dari resolusi tiket */
  initial?: Partial<TicketResolutionInput>;
};

function move<T>(arr: T[], from: number, to: number) {
  const a = arr.slice();
  const [spliced] = a.splice(from, 1);
  a.splice(to, 0, spliced);
  return a;
}
function isBlobUrl(u: string) {
  return typeof u === "string" && u.startsWith("blob:");
}
function revokeIfBlob(u: string) {
  if (isBlobUrl(u)) URL.revokeObjectURL(u);
}

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

  const [pickedPartIds, setPickedPartIds] = useState<string[]>(
    ((initial?.parts ?? []) as PartUsage[]).map((p) => p.partId)
  );
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(
      ((initial?.parts ?? []) as PartUsage[]).map((p) => [p.partId, p.qty])
    )
  );

  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);
  const replaceInputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleAddPhotos = (files: File[] | null) => {
    if (!files || files.length === 0) return;
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => {
      const next = [...prev, ...urls];
      setValue("photos", next, { shouldValidate: true });
      return next;
    });
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos((prev) => {
      const target = prev[idx];
      revokeIfBlob(target);
      const next = prev.filter((_, i) => i !== idx);
      setValue("photos", next, { shouldValidate: true });
      return next;
    });
  };

  const handleMoveLeft = (idx: number) => {
    if (idx <= 0) return;
    setPhotos((prev) => {
      const next = move(prev, idx, idx - 1);
      setValue("photos", next, { shouldValidate: true });
      return next;
    });
  };
  const handleMoveRight = (idx: number) => {
    setPhotos((prev) => {
      if (idx >= prev.length - 1) return prev;
      const next = move(prev, idx, idx + 1);
      setValue("photos", next, { shouldValidate: true });
      return next;
    });
  };

  const triggerReplace = (idx: number) => {
    replaceInputsRef.current[idx]?.click();
  };

  const handleReplaceFile = (idx: number, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotos((prev) => {
      const old = prev[idx];
      const next = prev.slice();
      next[idx] = url;
      setValue("photos", next, { shouldValidate: true });
      revokeIfBlob(old);
      return next;
    });
  };
  const { data: inventoryItems = [], isLoading: isLoadingParts } = useQuery<
    Part[]
  >({
    queryKey: ["parts", "list", "forAuditResolveModal"], // Key unik
    queryFn: listParts,
    enabled: opened, // Hanya fetch saat modal dibuka
    staleTime: 5 * 60 * 1000,
  });

  const partOptions = useMemo(
    () =>
      inventoryItems.map((p: Part) => ({
        // Gunakan data dari query
        value: p.id,
        label: p.name + (p.sku ? ` — ${p.sku}` : ""),
      })),
    [inventoryItems] // Dependensi ke hasil query
  );

  useEffect(() => {
    const parts: PartUsage[] = pickedPartIds.map((id) => {
      // Cari part di hasil query
      const p = inventoryItems.find((x) => x.id === id);
      // Handle jika part tidak ditemukan (seharusnya tidak terjadi jika UI benar)
      const partName = p?.name ?? `Part ID: ${id}`;
      const qty = Math.max(1, quantities[id] ?? 1);
      return { partId: id, name: partName, qty };
    });
    // Validasi sebelum set value (opsional tapi bagus)
    try {
      PartsArraySchema.parse(parts);
      setValue("parts", parts, { shouldValidate: true });
    } catch (e) {
      console.error("Invalid parts data:", e);
      // Mungkin tampilkan error ke user
    }
  }, [pickedPartIds, quantities, setValue, inventoryItems]);

  useEffect(() => {
    setValue("photos", photos, { shouldValidate: true });
  }, [photos, setValue]);

  useEffect(() => {
    if (opened) {
      reset({
        rootCause: initial?.rootCause ?? "",
        solution: initial?.solution ?? "",
        parts: initial?.parts ?? [],
        photos: initial?.photos ?? [],
        tags: initial?.tags ?? [],
      });
      setPickedPartIds(
        ((initial?.parts ?? []) as PartUsage[]).map((p) => p.partId)
      );
      setQuantities(
        Object.fromEntries(
          ((initial?.parts ?? []) as PartUsage[]).map((p) => [p.partId, p.qty])
        )
      );
      setPhotos(initial?.photos ?? []);
    }
    return () => {
      photos.forEach(revokeIfBlob);
    };
  }, [opened, initial, reset]);

  const partRows = pickedPartIds.map((id) => {
    // Cari part di hasil query
    const p = inventoryItems.find((x) => x.id === id);
    if (!p) return null; // Handle jika part tidak ditemukan
    const qty = Math.max(1, quantities[id] ?? 1);
    return (
      <Table.Tr key={id}>
        <Table.Td>{p.name}</Table.Td>
        <Table.Td>
          <NumberInput
            value={qty}
            min={1}
            onChange={(v) =>
              setQuantities((prev) => ({
                ...prev,
                [id]: typeof v === "number" ? v : Number(v) || 1,
              }))
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

          <Stack gap="xs">
            <FileInput
              label="Tambah foto dokumentasi"
              placeholder="Pilih gambar (bisa banyak)"
              multiple
              accept="image/*"
              onChange={(f) =>
                handleAddPhotos(Array.isArray(f) ? f : f ? [f] : null)
              }
              error={errors.photos?.message}
            />

            {photos.length > 0 ? (
              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs">
                {photos.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    style={{
                      position: "relative",
                      width: "100%",
                      height: 140,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid var(--mantine-color-gray-4)",
                    }}
                  >
                    <img
                      src={src}
                      alt={`photo-${i}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    <Group
                      gap={4}
                      style={{
                        position: "absolute",
                        right: rem(6),
                        top: rem(6),
                        background:
                          "color-mix(in srgb, var(--mantine-color-dark-9) 30%, transparent)",
                        borderRadius: 8,
                        padding: 4,
                      }}
                    >
                      <Tooltip label="Geser kiri">
                        <ActionIcon
                          size="sm"
                          variant="default"
                          onClick={() => handleMoveLeft(i)}
                          aria-label="Move left"
                        >
                          <IconArrowLeft size={14} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Geser kanan">
                        <ActionIcon
                          size="sm"
                          variant="default"
                          onClick={() => handleMoveRight(i)}
                          aria-label="Move right"
                        >
                          <IconArrowRight size={14} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Ganti foto">
                        <ActionIcon
                          size="sm"
                          variant="default"
                          onClick={() => triggerReplace(i)}
                          aria-label="Replace"
                        >
                          <IconPencil size={14} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Hapus foto">
                        <ActionIcon
                          size="sm"
                          variant="default"
                          color="red"
                          onClick={() => handleRemovePhoto(i)}
                          aria-label="Delete"
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Tooltip>

                      <input
                        ref={(el) => {
                          replaceInputsRef.current[i] = el;
                        }}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          handleReplaceFile(
                            i,
                            e.currentTarget.files?.[0] ?? null
                          )
                        }
                      />
                    </Group>
                  </div>
                ))}
              </SimpleGrid>
            ) : (
              <Text size="sm" c="dimmed">
                Belum ada foto. Tambahkan foto dokumentasi untuk memperkaya SOP.
              </Text>
            )}
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
