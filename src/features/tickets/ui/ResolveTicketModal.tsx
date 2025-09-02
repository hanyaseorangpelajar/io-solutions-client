"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Alert,
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
  TextInput,
  Textarea,
  Title,
  rem,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  PartsArraySchema,
  TicketResolutionSchema,
  type TicketResolutionInput,
  type CustomCostInput,
} from "../model/schema";
import type { PartUsage } from "../model/types";
import { INVENTORY_ITEMS } from "@/features/inventory/model/mock";

// ---------- Helpers ----------
function idr(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

type Props = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (v: TicketResolutionInput) => void;
  assignee?: string; // ← opsional
  title?: string;
  initial?: Partial<TicketResolutionInput>;
};

export default function ResolveTicketModal({
  opened,
  onClose,
  onSubmit,
  assignee,
  title = "Tandai tiket selesai",
  initial,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TicketResolutionInput>({
    resolver: zodResolver(TicketResolutionSchema),
    mode: "onChange",
    defaultValues: {
      rootCause: initial?.rootCause ?? "",
      solution: initial?.solution ?? "",
      parts: initial?.parts ?? [],
      photos: initial?.photos ?? [],
      tags: initial?.tags ?? [],
      extraCosts: initial?.extraCosts ?? [],
    },
  });

  // --- Parts picker state ---
  const [pickedPartIds, setPickedPartIds] = useState<string[]>(
    (initial?.parts ?? []).map((p) => p.partId)
  );
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries((initial?.parts ?? []).map((p) => [p.partId, p.qty]))
  );

  // --- Photos state ---
  const [existingPhotos] = useState<string[]>(initial?.photos ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const newPhotoUrls = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  // --- Extra costs state ---
  const [costs, setCosts] = useState<CustomCostInput[]>(
    initial?.extraCosts ?? []
  );

  // --- Options dari inventory (agar ada harga) ---
  const partOptions = useMemo(
    () =>
      INVENTORY_ITEMS.map((p) => ({
        value: p.id,
        label: `${p.name}${p.sku ? ` (${p.sku})` : ""}`,
      })),
    []
  );

  // Sync parts -> form
  useEffect(() => {
    const parts: PartUsage[] = pickedPartIds.map((id) => {
      const p = INVENTORY_ITEMS.find((x) => x.id === id)!;
      const qty = Math.max(1, quantities[id] ?? 1);
      return { partId: id, name: p.name, qty };
    });
    PartsArraySchema.parse(parts);
    setValue("parts", parts, { shouldValidate: true });
  }, [pickedPartIds, quantities, setValue]);

  // Sync photos -> form
  useEffect(() => {
    const all = [...existingPhotos, ...newPhotoUrls];
    setValue("photos", all, { shouldValidate: true });
    return () => newPhotoUrls.forEach((u) => URL.revokeObjectURL(u));
  }, [existingPhotos, newPhotoUrls, setValue]);

  // Sync extraCosts -> form
  useEffect(() => {
    setValue("extraCosts", costs, { shouldValidate: true });
  }, [costs, setValue]);

  // Reset saat modal dibuka
  useEffect(() => {
    if (opened) {
      reset({
        rootCause: initial?.rootCause ?? "",
        solution: initial?.solution ?? "",
        parts: initial?.parts ?? [],
        photos: initial?.photos ?? [],
        tags: initial?.tags ?? [],
        extraCosts: initial?.extraCosts ?? [],
      });
      setPickedPartIds((initial?.parts ?? []).map((p) => p.partId));
      setQuantities(
        Object.fromEntries((initial?.parts ?? []).map((p) => [p.partId, p.qty]))
      );
      setCosts(initial?.extraCosts ?? []);
      setFiles([]);
    }
  }, [opened, initial, reset]);

  // ---------- Kalkulasi biaya parts ----------
  type Line = {
    id: string;
    name: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
    hasPrice: boolean;
  };

  const partLines: Line[] = useMemo(() => {
    return pickedPartIds.map((id) => {
      const item = INVENTORY_ITEMS.find((x) => x.id === id)!;
      const qty = Math.max(1, quantities[id] ?? 1);
      const unitPrice = Math.max(0, item.price ?? 0);
      return {
        id,
        name: item.name,
        qty,
        unitPrice,
        lineTotal: unitPrice * qty,
        hasPrice: typeof item.price === "number",
      };
    });
  }, [pickedPartIds, quantities]);

  const partsTotal = useMemo(
    () => partLines.reduce((s, l) => s + l.lineTotal, 0),
    [partLines]
  );
  const hasMissingPrices = useMemo(
    () => partLines.some((l) => !l.hasPrice),
    [partLines]
  );

  // ---------- Kalkulasi biaya tambahan ----------
  const extraTotal = useMemo(
    () =>
      costs.reduce(
        (s, c) => s + (Number.isFinite(c.amount) ? Number(c.amount) : 0),
        0
      ),
    [costs]
  );

  const grandTotal = partsTotal + extraTotal;

  // ---------- UI handlers ----------
  const addCostRow = () =>
    setCosts((prev) => [...prev, { label: "", amount: 0 }]);

  const updateCost = (idx: number, patch: Partial<CustomCostInput>) =>
    setCosts((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...patch } : c))
    );

  const removeCost = (idx: number) =>
    setCosts((prev) => prev.filter((_, i) => i !== idx));

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
          <Title order={6}>Ringkasan Perbaikan</Title>
          <Textarea
            label="Akar masalah"
            placeholder="Jelaskan akar masalah spesifik & cara mengidentifikasinya"
            minRows={3}
            autosize
            error={errors.rootCause?.message}
            {...register("rootCause")}
          />
          <Textarea
            label="Solusi / Troubleshoot"
            placeholder="Langkah-langkah yang dilakukan hingga perbaikan selesai"
            minRows={3}
            autosize
            error={errors.solution?.message}
            {...register("solution")}
          />

          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <MultiSelect
              label="Parts dari gudang"
              placeholder="Pilih part yang digunakan"
              data={partOptions}
              value={pickedPartIds}
              onChange={setPickedPartIds}
              searchable
              nothingFoundMessage="Part tidak ditemukan"
            />

            <TagsInput
              label="Hashtag / Tag"
              placeholder="#hardware #SOP"
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

          {/* Rincian Parts + Total */}
          {pickedPartIds.length > 0 && (
            <Paper withBorder radius="md" p="sm">
              <Table withRowBorders={false} highlightOnHover={false}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Part</Table.Th>
                    <Table.Th w={120}>Qty</Table.Th>
                    <Table.Th w={150} style={{ textAlign: "right" }}>
                      Harga Unit
                    </Table.Th>
                    <Table.Th w={160} style={{ textAlign: "right" }}>
                      Subtotal
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {partLines.map((ln) => (
                    <Table.Tr key={ln.id}>
                      <Table.Td>{ln.name}</Table.Td>
                      <Table.Td>
                        <NumberInput
                          min={1}
                          clampBehavior="strict"
                          value={ln.qty}
                          onChange={(v) =>
                            setQuantities((prev) => ({
                              ...prev,
                              [ln.id]:
                                typeof v === "number" ? v : Number(v) || 1,
                            }))
                          }
                          allowDecimal={false}
                          w={110}
                        />
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        {ln.hasPrice ? (
                          idr(ln.unitPrice)
                        ) : (
                          <Text size="sm" c="dimmed">
                            (belum di-set)
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right", fontWeight: 600 }}>
                        {idr(ln.lineTotal)}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  <Table.Tr>
                    <Table.Td colSpan={2} />
                    <Table.Td style={{ textAlign: "right", fontWeight: 600 }}>
                      Total Parts
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right", fontWeight: 800 }}>
                      {idr(partsTotal)}
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              {hasMissingPrices && (
                <Alert
                  mt="sm"
                  color="yellow"
                  title="Beberapa harga belum di-set"
                >
                  Ada part yang belum memiliki harga di Inventory. Total parts
                  bersifat estimasi (harga kosong dianggap Rp0). Lengkapi harga
                  di menu <b>Inventory → Items</b>.
                </Alert>
              )}
            </Paper>
          )}

          {/* Biaya Tambahan */}
          <Paper withBorder radius="md" p="sm">
            <Group justify="space-between" mb="xs">
              <Title order={6}>Biaya Tambahan</Title>
              <Button
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={addCostRow}
              >
                Tambah biaya
              </Button>
            </Group>

            {costs.length === 0 ? (
              <Text size="sm" c="dimmed">
                Tidak ada biaya tambahan. Tambahkan jika ada biaya servis,
                konsultasi, dll.
              </Text>
            ) : (
              <Stack gap="xs">
                {costs.map((c, idx) => (
                  <Group key={idx} align="end" wrap="wrap">
                    <TextInput
                      label="Nama biaya"
                      placeholder="Servis / Konsultasi / Kunjungan"
                      value={c.label}
                      onChange={(e) =>
                        updateCost(idx, { label: e.currentTarget.value })
                      }
                      style={{ minWidth: 260 }}
                      withAsterisk
                    />
                    <NumberInput
                      label="Jumlah"
                      min={0}
                      clampBehavior="strict"
                      value={c.amount}
                      onChange={(v) =>
                        updateCost(idx, {
                          amount: typeof v === "number" ? v : Number(v) || 0,
                        })
                      }
                      // Mantine v7: gunakan prefix, tidak ada parser/formatter
                      prefix="Rp "
                      style={{ minWidth: 220 }}
                      withAsterisk
                    />
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      aria-label="Hapus biaya"
                      onClick={() => removeCost(idx)}
                      style={{ marginBottom: rem(6) }}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            )}

            <Group justify="flex-end" mt="sm">
              <Text size="sm" c="dimmed" fw={600}>
                Total Biaya Tambahan: {idr(extraTotal)}
              </Text>
            </Group>
          </Paper>

          {/* Upload foto */}
          <Stack gap={6}>
            <FileInput
              label="Foto dokumentasi (opsional)"
              placeholder="Pilih gambar"
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

          {/* Grand total */}
          <Paper withBorder radius="md" p="sm">
            <Group justify="space-between">
              <Text fw={700}>Grand Total</Text>
              <Title order={4}>{idr(grandTotal)}</Title>
            </Group>
          </Paper>

          <Group justify="end" mt="xs">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={!isValid} loading={isSubmitting}>
              Simpan & Tandai Selesai
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
