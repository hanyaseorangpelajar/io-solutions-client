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
} from "@mantine/core";
import { IconCheck, IconInfoCircle, IconSearch } from "@tabler/icons-react";
import { INVENTORY_ITEMS } from "../model/mock";
import type { Part } from "../model/types";
import type { Ticket } from "@/features/tickets/model/types";
import { MOCK_TICKETS } from "@/features/tickets/model/mock";

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
  matchedItemId?: string; // id item inventory
};

type Props = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: StockOutFromTicketPayload) => void;
  title?: string;
};

function bestGuessMatch(partName: string, items: Part[]): string | undefined {
  const target = partName.trim().toLowerCase();
  // 1) exact
  let hit = items.find((i) => i.name.trim().toLowerCase() === target);
  if (hit) return hit.id;
  // 2) contains
  hit = items.find(
    (i) =>
      i.name.toLowerCase().includes(target) ||
      target.includes(i.name.toLowerCase())
  );
  if (hit) return hit.id;
  // 3) by SKU included in name
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
}: Props) {
  const [ticketCode, setTicketCode] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  // hanya ticket resolved yang punya parts
  const ticketOptions = useMemo(() => {
    return MOCK_TICKETS.filter(
      (t) => t.status === "resolved" && t.resolution?.parts?.length
    ).map((t) => t.code);
  }, []);

  // saat user memilih/memasukkan ticket code
  useEffect(() => {
    if (!opened) return;
    const found = MOCK_TICKETS.find((t) => t.code === ticketCode);
    setTicket(found ?? null);
    if (found?.resolution?.parts && found.resolution.parts.length > 0) {
      const mapped: Row[] = found.resolution.parts.map((p) => ({
        partId: p.partId,
        partName: p.name,
        qty: p.qty,
        matchedItemId: bestGuessMatch(p.name, INVENTORY_ITEMS),
      }));
      setRows(mapped);
    } else {
      setRows([]);
    }
  }, [ticketCode, opened]);

  const itemOptions = useMemo(
    () =>
      INVENTORY_ITEMS.map((i) => ({
        value: i.id,
        label: `${i.name}${i.sku ? ` (${i.sku})` : ""} — stok: ${i.stock}`,
      })),
    []
  );

  const allMapped =
    rows.length > 0 && rows.every((r) => !!r.matchedItemId && r.qty > 0);
  const totalQty = rows.reduce((s, r) => s + (r.qty || 0), 0);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      radius="lg"
      size="lg"
      centered
    >
      <Stack gap="md">
        <Select
          label="Ticket (resolved)"
          placeholder="Pilih kode ticket (mis. TCK-2025-000125)"
          value={ticketCode || null}
          onChange={(v) => setTicketCode(v ?? "")}
          data={ticketOptions}
          searchable
          leftSection={<IconSearch size={16} />}
          nothingFoundMessage="Ticket tidak ditemukan / belum resolved / tanpa parts"
          withAsterisk
          clearable
          comboboxProps={{ withinPortal: true }}
        />

        {!ticket && ticketCode && (
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
                  <Table.Th w="25%">Map ke Item Gudang</Table.Th>
                  <Table.Th w={120}>Qty</Table.Th>
                  <Table.Th>Catatan</Table.Th>
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
                        placeholder="Pilih item"
                        value={r.matchedItemId ?? null}
                        data={itemOptions}
                        searchable
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
                          Belum dipetakan
                        </Text>
                      ) : (
                        <Group gap={6}>
                          <IconCheck
                            size={14}
                            color="var(--mantine-color-green-6)"
                          />
                          <Text size="xs" c="dimmed">
                            Siap
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
                    if (!ticket) return;
                    onSubmit({
                      ticketId: ticket.id,
                      ticketCode: ticket.code,
                      lines: rows
                        .filter((r) => r.matchedItemId && r.qty > 0)
                        .map((r) => ({
                          itemId: r.matchedItemId!,
                          qty: r.qty,
                          partName: r.partName,
                        })),
                    });
                    onClose();
                  }}
                  disabled={!allMapped}
                >
                  Konfirmasi Stock Out
                </Button>
              </Group>
            </Group>
          </Paper>
        )}

        {!rows.length && ticket && (
          <Alert color="blue" icon={<IconInfoCircle size={16} />}>
            Ticket ini tidak memiliki parts pada resolusi—tidak ada yang perlu
            di-*stock out*.
          </Alert>
        )}
      </Stack>
    </Modal>
  );
}
