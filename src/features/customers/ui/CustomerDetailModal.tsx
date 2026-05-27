"use client";

import {
  Modal,
  Stack,
  Title,
  Text,
  Divider,
  Group,
  Grid,
  Card,
  Loader,
} from "@mantine/core";
import type { Customer } from "../model/types";
import { formatDateTime } from "@/features/tickets/utils/format";
import { useQuery } from "@tanstack/react-query";
import { listTickets } from "@/features/tickets/api/tickets";
import TicketStatusBadge from "@/features/tickets/ui/TicketStatusBadge";
import Link from "next/link";
import type { Ticket } from "@/features/tickets/model/types";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: Customer | null;
};

const safeFormatDateTime = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return formatDateTime(dateString);
  } catch (e) {
    return dateString;
  }
};

export default function CustomerDetailModal({ opened, onClose, data }: Props) {
  const customerId = data?.id ?? (data as any)?._id;
  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ["tickets", "customer", customerId],
    queryFn: () => listTickets({ customerId, limit: 10 }),
    enabled: !!customerId,
  });

  const tickets: Ticket[] =
    (ticketsData as any)?.results ?? (ticketsData as any)?.data ?? [];

  if (!data) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Detail Pelanggan"
      size="xl"
      centered
    >
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md" pb="md">
            <Stack gap={4}>
              <Title order={4}>{data.nama}</Title>
              <Text c="dimmed">{data.noHp}</Text>
            </Stack>

            <Group grow>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  Dibuat Pada
                </Text>
                <Text size="sm">{safeFormatDateTime(data.dibuatPada)}</Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  Diperbarui Pada
                </Text>
                <Text size="sm">{safeFormatDateTime(data.diperbaruiPada)}</Text>
              </Stack>
            </Group>

            <Divider />

            <Stack gap={6}>
              <Text size="sm" c="dimmed" fw={600}>
                Alamat
              </Text>
              <Text size="sm" lh={1.5} style={{ whiteSpace: "pre-wrap" }}>
                {data.alamat || "-"}
              </Text>
            </Stack>

            <Stack gap={6}>
              <Text size="sm" c="dimmed" fw={600}>
                Catatan
              </Text>
              <Text size="sm" lh={1.5} style={{ whiteSpace: "pre-wrap" }}>
                {data.catatan || "-"}
              </Text>
            </Stack>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="sm">
            <Text fw={600} size="md">
              Riwayat Tiket
            </Text>
            {isLoading ? (
              <Loader size="sm" />
            ) : tickets.length === 0 ? (
              <Text size="sm" c="dimmed">
                Belum ada tiket untuk pelanggan ini.
              </Text>
            ) : (
              <Stack gap="xs">
                {tickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    component={Link}
                    href={`/views/tickets/${ticket.id}`}
                    withBorder
                    shadow="sm"
                    radius="md"
                    p="sm"
                    style={{ textDecoration: "none" }}
                  >
                    <Group justify="space-between" mb={4} wrap="nowrap">
                      <Text fw={600} size="sm" c="blue" truncate>
                        {ticket.nomorTiket}
                      </Text>
                      <TicketStatusBadge status={ticket.status} />
                    </Group>
                    <Text size="xs" c="dimmed" lineClamp={2}>
                      {ticket.keluhanAwal}
                    </Text>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}
