"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ActionIcon,
  Badge,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import type { Ticket } from "../model/types";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
import { formatDateTime } from "../utils/format";
import { getTicket } from "../api/tickets";

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id ?? "");

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  const closeDetail = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/views/tickets");
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const t = await getTicket(id);
        if (active) setTicket(t);
      } catch {
        if (active) setTicket(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Paper withBorder p="lg" radius="md">
        <Group justify="space-between" mb="sm">
          <Title order={3}>Ticket</Title>
          <ActionIcon
            variant="light"
            radius="xl"
            onClick={closeDetail}
            aria-label="Tutup"
          >
            <IconX size={18} />
          </ActionIcon>
        </Group>
        <Text>Memuat...</Text>
      </Paper>
    );
  }

  if (!ticket) {
    return (
      <Paper withBorder p="lg" radius="md">
        <Group justify="space-between" mb="sm">
          <Title order={3}>Ticket</Title>
          <Tooltip label="Tutup detail">
            <ActionIcon
              variant="light"
              radius="xl"
              onClick={closeDetail}
              aria-label="Tutup"
            >
              <IconX size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Text>Ticket tidak ditemukan.</Text>
      </Paper>
    );
  }

  const {
    code,
    subject,
    requester,
    assignee,
    priority,
    status,
    createdAt,
    updatedAt,
    description,
    resolution,
  } = ticket;

  const hasResolution = !!resolution;

  const partLines = useMemo(
    () =>
      resolution?.parts?.map((p: any) => ({ name: p.name, qty: p.qty })) ?? [],
    [resolution]
  );

  return (
    <Stack gap="md">
      {/* Header */}
      <Group justify="space-between" align="center">
        <Stack gap={4}>
          <Group gap="xs" wrap="wrap">
            <Title order={3} style={{ lineHeight: 1.15 }}>
              {code}
            </Title>
            <TicketStatusBadge status={status} />
            <TicketPriorityBadge priority={priority} />
          </Group>
          <Text c="dimmed">{subject}</Text>
        </Stack>

        <Tooltip label="Tutup detail">
          <ActionIcon
            variant="light"
            radius="xl"
            onClick={closeDetail}
            aria-label="Tutup"
          >
            <IconX size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Paper withBorder radius="md" p="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Pemohon
            </Text>
            <Text fw={600}>{requester}</Text>
          </Stack>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Assignee
            </Text>
            <Text fw={600}>{assignee || "-"}</Text>
          </Stack>

          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Dibuat
            </Text>
            <Text fw={600}>{formatDateTime(createdAt)}</Text>
          </Stack>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Diperbarui
            </Text>
            <Text fw={600}>{formatDateTime(updatedAt)}</Text>
          </Stack>
        </SimpleGrid>

        {description && (
          <>
            <Divider my="md" />
            <Stack gap={6}>
              <Text fw={600}>Deskripsi</Text>
              <Text c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
                {description}
              </Text>
            </Stack>
          </>
        )}
      </Paper>

      {/* Resolution */}
      {hasResolution ? (
        <Paper withBorder radius="md" p="md">
          <Group justify="space-between" mb="xs">
            <Text fw={700}>Ringkasan Penyelesaian</Text>
            {resolution?.resolvedAt && (
              <Badge variant="light" color="green">
                Selesai {formatDateTime(String(resolution.resolvedAt))}
              </Badge>
            )}
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="md">
            <Stack gap={6}>
              <Text size="sm" c="dimmed">
                Akar masalah
              </Text>
              <Text>
                {(resolution as any).rootCause ||
                  (resolution as any).note ||
                  "-"}
              </Text>
            </Stack>
            <Stack gap={6}>
              <Text size="sm" c="dimmed">
                Solusi
              </Text>
              <Text>{(resolution as any).solution || "-"}</Text>
            </Stack>
          </SimpleGrid>

          {Array.isArray((resolution as any).tags) &&
            (resolution as any).tags.length > 0 && (
              <>
                <Divider my="sm" />
                <Group gap="xs" wrap="wrap">
                  <Text size="sm" c="dimmed">
                    Tags:
                  </Text>
                  {(resolution as any).tags.map((t: string) => (
                    <Badge key={t} variant="outline">
                      #{t}
                    </Badge>
                  ))}
                </Group>
              </>
            )}

          {partLines.length > 0 && (
            <>
              <Divider my="sm" />
              <Stack gap="xs">
                <Text fw={600}>Parts yang digunakan</Text>
                <Table withRowBorders={false} highlightOnHover={false}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Part</Table.Th>
                      <Table.Th w={120}>Qty</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {partLines.map((ln, i) => (
                      <Table.Tr key={`${ln.name}-${i}`}>
                        <Table.Td>{ln.name}</Table.Td>
                        <Table.Td>{ln.qty}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Stack>
            </>
          )}

          {Array.isArray((resolution as any).photos) &&
            (resolution as any).photos.length > 0 && (
              <>
                <Divider my="sm" />
                <Stack gap="xs">
                  <Text fw={600}>Dokumentasi Foto</Text>
                  <SimpleGrid cols={{ base: 2, sm: 4 }}>
                    {(resolution as any).photos.map(
                      (src: string, i: number) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={src}
                          alt={`photo-${i}`}
                          style={{
                            width: "100%",
                            height: 140,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "1px solid var(--mantine-color-gray-4)",
                          }}
                        />
                      )
                    )}
                  </SimpleGrid>
                </Stack>
              </>
            )}
        </Paper>
      ) : (
        <Paper withBorder radius="md" p="md">
          <Text c="dimmed">
            Ticket belum diselesaikan. Setelah tiket di-*resolve*, ringkasan
            penyelesaian akan tampil di sini.
          </Text>
        </Paper>
      )}
    </Stack>
  );
}
