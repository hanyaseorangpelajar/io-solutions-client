"use client";

import { notFound, useParams } from "next/navigation";
import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";
import { formatDateTime } from "../utils/format";
import { getMockTicketById } from "../model/mock";

export function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const ticket = getMockTicketById(params.id);

  if (!ticket) return notFound();

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Title order={3}>{ticket.code}</Title>
        <Group gap="xs">
          <TicketPriorityBadge priority={ticket.priority} />
          <TicketStatusBadge status={ticket.status} />
        </Group>
      </Group>

      <Card withBorder radius="md" p="md">
        <Stack gap={6}>
          <Text>
            <strong>Subjek:</strong> {ticket.subject}
          </Text>
          <Text>
            <strong>Pemohon:</strong> {ticket.requester}
          </Text>
          <Text>
            <strong>Teknisi:</strong> {ticket.assignee ?? "-"}
          </Text>
          <Text>
            <strong>Dibuat:</strong> {formatDateTime(ticket.createdAt)}
          </Text>
          <Text>
            <strong>Diperbarui:</strong> {formatDateTime(ticket.updatedAt)}
          </Text>
          {ticket.description ? (
            <Text>
              <strong>Deskripsi:</strong> {ticket.description}
            </Text>
          ) : null}
        </Stack>
      </Card>

      <Card withBorder radius="md" p="md">
        <Title order={5} mb="xs">
          Aktivitas
        </Title>
        <Text c="dimmed" size="sm">
          Belum ada aktivitas (UI-only).
        </Text>
      </Card>
    </Stack>
  );
}
