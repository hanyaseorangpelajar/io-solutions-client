"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { IconCheck, IconInfoCircle, IconSearch } from "@tabler/icons-react";
import type { Part } from "../model/types";
import type { Ticket, PartUsage } from "@/features/tickets/model/types";

import { useQuery } from "@tanstack/react-query";
import { listTickets } from "@/features/tickets/api/tickets";
import { listParts } from "../api/parts";
import { notifications } from "@mantine/notifications";

/** Payload hasil mapping yang akan dieksekusi caller */
export type StockOutFromTicketPayload = {
  ticketId: string;
  ticketCode: string;
  lines: { itemId: string; qty: number; partName: string }[];
};

type Row = {
  partId: string;
  partName: string;
  qty: number;
  matchedItemId?: string;
};

type Props = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: StockOutFromTicketPayload) => void;
  title?: string;
  isSubmitting?: boolean;
};

function bestGuessMatch(partName: string, items: Part[]): string | undefined {
  const target = partName.trim().toLowerCase();
  let hit = items.find((i) => i.name.trim().toLowerCase() === target);
  if (hit) return hit.id;
  hit = items.find(
    (i) =>
      i.name.toLowerCase().includes(target) ||
      target.includes(i.name.toLowerCase())
  );
  if (hit) return hit.id;
  hit = items.find(
    (i) =>
      (i.sku ?? "").toLowerCase() &&
      target.includes((i.sku ?? "").toLowerCase())
  );
  return hit?.id;
}

export default function StockOutFromTicketModal({
  opened,
  onClose,
  onSubmit,
  title = "Stock Out dari Ticket",
  isSubmitting,
}: Props) {
  const [ticketCode, setTicketCode] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  const { data: inventoryItems, isLoading: isLoadingParts } = useQuery<Part[]>({
    queryKey: ["parts", "list", "forStockOutModal"],
    queryFn: listParts,
    enabled: opened,
    staleTime: 5 * 60 * 1000,
    initialData: [],
  });

  const { data: resolvedTickets, isLoading: isLoadingTickets } = useQuery<
    Ticket[]
  >({
    queryKey: ["tickets", "list", { status: "resolved" }],
    queryFn: async () => {
      const res = await listTickets({ status: "resolved", limit: 500 });
      return res.data ?? [];
    },
    enabled: opened,
    staleTime: 5 * 60 * 1000,
    initialData: [],
  });

  const ticketOptions = useMemo(() => {
    return resolvedTickets.map((t) => ({ value: t.code, label: t.code }));
  }, [resolvedTickets]);

  const selectedTicket = useMemo(
    () => resolvedTickets.find((t) => t.code === ticketCode) ?? null,
    [resolvedTickets, ticketCode]
  );

  const mappedFromTicket = useMemo<Row[]>(() => {
    if (!selectedTicket?.resolution?.parts?.length) return [];
    return selectedTicket.resolution.parts.map((p: PartUsage) => ({
      partId: p.partId,
      partName: p.name,
      qty: p.qty,
      matchedItemId: bestGuessMatch(p.name, inventoryItems),
    }));
  }, [selectedTicket, inventoryItems]);

  useEffect(() => {
    if (!opened) {
      setTicketCode("");
      setRows([]);
    }
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    setRows((prev) => {
      if (
        prev.length === mappedFromTicket.length &&
        prev.every(
          (r, i) =>
            r.partId === mappedFromTicket[i].partId &&
            r.qty === mappedFromTicket[i].qty &&
            r.matchedItemId === mappedFromTicket[i].matchedItemId
        )
      )
        return prev;
      return mappedFromTicket;
    });
  }, [opened, mappedFromTicket]);

  const itemOptions = useMemo(
    () =>
      inventoryItems.map((i) => ({
        value: i.id,
        label: `${i.name}${i.sku ? ` (${i.sku})` : ""} — stok: ${i.stock}`,
      })),
    [inventoryItems]
  );

  const allMapped =
    rows.length > 0 && rows.every((r) => !!r.matchedItemId && r.qty > 0);
  const totalQty = rows.reduce((s, r) => s + (r.qty || 0), 0);
  const isLoading = (isLoadingParts || isLoadingTickets) && opened;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      radius="lg"
      size="xl"
      centered
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
    >
      <Stack gap="md" style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} />

        <Select
          label="Ticket (resolved)"
          placeholder="Pilih kode ticket..."
          value={ticketCode || null}
          onChange={(v) => setTicketCode(v ?? "")}
          data={ticketOptions}
          searchable
          disabled={isLoadingTickets}
          leftSection={<IconSearch size={16} />}
          nothingFoundMessage="Ticket tidak ditemukan / belum resolved / tanpa parts"
          withAsterisk
          clearable
          comboboxProps={{ withinPortal: true }}
        />

        {!selectedTicket && ticketCode && !isLoadingTickets && (
          <Alert color="yellow" icon={<IconInfoCircle size={16} />}>
            Ticket tidak ditemukan atau belum memiliki data parts pada
            resolusinya.
          </Alert>
        )}

        {rows.length > 0 && (
          <Paper withBorder radius="md" p="sm">
            <Table withRowBorders={false} highlightOnHover={false}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w="35%">Part (dari Ticket)</Table.Th>
                  <Table.Th w="35%">Map ke Item Gudang</Table.Th>{" "}
                  <Table.Th w={100}>Qty</Table.Th>
                  <Table.Th w={100}>Catatan</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((r, idx) => (
                  <Table.Tr key={`${r.partId}-${idx}`}>
                    <Table.Td style={{ fontWeight: 600 }}>
                      {r.partName}
                    </Table.Td>
                    <Table.Td>
                      <Select
                        placeholder="Pilih item inventory..."
                        value={r.matchedItemId ?? null}
                        data={itemOptions}
                        searchable
                        disabled={isLoadingParts}
                        onChange={(v) =>
                          setRows((prev) =>
                            prev.map((x, i) =>
                              i === idx
                                ? { ...x, matchedItemId: v ?? undefined }
                                : x
                            )
                          )
                        }
                        nothingFoundMessage="Item tidak ditemukan"
                        comboboxProps={{ withinPortal: true }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        min={1}
                        clampBehavior="strict"
                        value={r.qty}
                        onChange={(v) =>
                          setRows((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, qty: Number(v) || 1 } : x
                            )
                          )
                        }
                      />
                    </Table.Td>
                    <Table.Td>
                      {!r.matchedItemId ? (
                        <Text size="xs" c="red">
                          Belum OK
                        </Text>
                      ) : (
                        <Group gap={6}>
                          <IconCheck
                            size={14}
                            color="var(--mantine-color-green-6)"
                          />
                          <Text size="xs" c="dimmed">
                            OK
                          </Text>
                        </Group>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Group justify="space-between" mt="sm">
              <Text size="sm" c="dimmed">
                Total baris: {rows.length} • Total qty: {totalQty}
              </Text>
              <Group>
                <Button variant="default" onClick={onClose}>
                  Batal
                </Button>
                <Button
                  onClick={() => {
                    if (!selectedTicket) return;
                    onSubmit({
                      ticketId: selectedTicket.id,
                      ticketCode: selectedTicket.code,
                      lines: rows
                        .filter((r) => r.matchedItemId && r.qty > 0)
                        .map((r) => ({
                          itemId: r.matchedItemId!,
                          qty: r.qty,
                          partName: r.partName,
                        })),
                    });
                  }}
                  disabled={!allMapped || isSubmitting || isLoading}
                  loading={isSubmitting}
                >
                  Konfirmasi Stock Out
                </Button>
              </Group>
            </Group>
          </Paper>
        )}

        {!rows.length && selectedTicket && !isLoading && (
          <Alert color="blue" icon={<IconInfoCircle size={16} />}>
            Ticket ini tidak memiliki parts pada resolusi—tidak ada yang perlu
            di-*stock out*.
          </Alert>
        )}
      </Stack>
    </Modal>
  );
}
