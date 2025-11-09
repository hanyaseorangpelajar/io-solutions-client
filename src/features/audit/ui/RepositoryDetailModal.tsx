"use client";

import {
  Modal,
  Stack,
  Title,
  Text,
  Divider,
  Group,
  Badge,
  ScrollArea,
  rem,
  Image,
} from "@mantine/core";
import { IconCalendar, IconDeviceDesktop, IconHash } from "@tabler/icons-react";
import type { RepositoryCardData } from "./RepositoryCard";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: RepositoryCardData | null;
};

export default function RepositoryDetailModal({
  opened,
  onClose,
  data,
}: Props) {
  if (!data) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Detail SOP: ${data.code}`}
      size="lg"
      centered
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="md" pb="md">
        {data.imageUrl && (
          <Image
            src={data.imageUrl}
            alt="Dokumentasi"
            radius="md"
            mah={400}
            fit="contain"
          />
        )}

        <Title order={4}>{data.subject}</Title>
        <Group gap="xs" wrap="wrap">
          {data.deviceType ? (
            <Badge
              leftSection={<IconDeviceDesktop size={14} />}
              variant="light"
            >
              {data.deviceType}
            </Badge>
          ) : null}
          {data.resolvedAt ? (
            <Badge leftSection={<IconCalendar size={14} />} variant="light">
              {data.resolvedAt}
            </Badge>
          ) : null}
          {data.tags.map((t) => (
            <Badge key={t} leftSection={<IconHash size={12} />} variant="light">
              {t}
            </Badge>
          ))}
        </Group>
        <Divider />

        <Stack gap={6}>
          <Text size="sm" c="dimmed" fw={600}>
            Akar Masalah (Diagnosis)
          </Text>
          <Text size="sm" lh={1.5} style={{ whiteSpace: "pre-wrap" }}>
            {data.rootCause}
          </Text>
        </Stack>

        <Stack gap={6}>
          <Text size="sm" c="dimmed" fw={600}>
            Solusi / Troubleshoot
          </Text>
          <Text size="sm" lh={1.5} style={{ whiteSpace: "pre-wrap" }}>
            {data.solution}
          </Text>
        </Stack>
      </Stack>
    </Modal>
  );
}
