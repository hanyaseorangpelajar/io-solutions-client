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
import type { CustomerDto } from "../model/types";
import { formatDateTime } from "@/features/tickets/utils/format";
import { useQuery } from "@tanstack/react-query";
import { listTickets } from "@/features/tickets/api/tickets";
import TicketStatusBadge from "@/features/tickets/ui/TicketStatusBadge";
import Link from "next/link";
import type { ServiceTicketDto } from "@/features/tickets/model/types";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: CustomerDto | null;
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
  const customerId = data?.customerId;

  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ["tickets", "customer", customerId],
    queryFn: () => listTickets({ customerId, limit: 10 }),
    enabled: !!customerId,
  });

  // Fetcher listTickets sekarang mengembalikan properti 'data' (bukan 'results')
  const tickets: ServiceTicketDto[] = ticketsData?.data ?? [];

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
              <Title order={4}>{data.name}</Title>
              <Text c="dimmed">{data.phone}</Text>
            </Stack>

            <Group grow>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  Dibuat Pada
                </Text>
                <Text size="sm">{safeFormatDateTime(data.createdAt)}</Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  Diperbarui Pada
                </Text>
                <Text size="sm">{safeFormatDateTime(data.updatedAt)}</Text>
              </Stack>
            </Group>

            <Divider />

            <Stack gap={6}>
              <Text size="sm" c="dimmed" fw={600}>
                Alamat
              </Text>
              <Text size="sm" lh={1.5} style={{ whiteSpace: "pre-wrap" }}>
                {data.address || "-"}
              </Text>
            </Stack>

            <Stack gap={6}>
              <Text size="sm" c="dimmed" fw={600}>
                Catatan
              </Text>
              <Text size="sm" lh={1.5} style={{ whiteSpace: "pre-wrap" }}>
                {data.note || "-"}
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
                    key={ticket.ticketId}
                    component={Link}
                    href={`/views/tickets/${ticket.ticketId}`}
                    withBorder
                    shadow="sm"
                    radius="md"
                    p="sm"
                    style={{ textDecoration: "none" }}
                  >
                    <Group justify="space-between" mb={4} wrap="nowrap">
                      <Text fw={600} size="sm" c="blue" truncate>
                        {ticket.ticketNumber}
                      </Text>
                      <TicketStatusBadge status={ticket.status} />
                    </Group>
                    <Text size="xs" c="dimmed" lineClamp={2}>
                      {ticket.initialComplaint}
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
