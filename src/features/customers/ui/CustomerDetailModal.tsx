"use client";

import { Modal, Stack, Title, Text, Divider, Group } from "@mantine/core";
import type { Customer } from "../model/types";
import { formatDateTime } from "@/features/tickets/utils/format";

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
  if (!data) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Detail Pelanggan"
      size="lg"
      centered
    >
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
    </Modal>
  );
}
