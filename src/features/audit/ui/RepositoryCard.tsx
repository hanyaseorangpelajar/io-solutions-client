"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconCalendar, IconHash, IconDeviceDesktop } from "@tabler/icons-react";

export type RepositoryCardData = {
  code: string;
  ticketId: string | null;
  subject: string;
  deviceType?: string;
  resolvedAt?: string;
  tags: string[];
  rootCause: string;
  solution: string;
  cover?: string;
};

type Props = {
  data: RepositoryCardData;
};

export default function RepositoryCard({ data }: Props) {
  const {
    code,
    ticketId,
    subject,
    deviceType,
    resolvedAt,
    tags,
    rootCause,
    solution,
    cover,
  } = data;

  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="sm">
        {cover ? (
          <Image
            src={cover}
            alt={subject}
            height={140}
            radius="sm"
            fit="cover"
            fallbackSrc="data:image/gif;base64,R0lGODlhAQABAAAAACw="
          />
        ) : null}

        <Stack gap={2}>
          <Title order={5} lineClamp={2}>
            {subject}
          </Title>
          <Text size="sm" c="dimmed">
            {code}
          </Text>
        </Stack>

        <Group gap="xs" wrap="wrap">
          {deviceType ? (
            <Badge
              leftSection={<IconDeviceDesktop size={14} />}
              variant="light"
            >
              {deviceType}
            </Badge>
          ) : null}
          {resolvedAt ? (
            <Badge leftSection={<IconCalendar size={14} />} variant="light">
              {resolvedAt}
            </Badge>
          ) : null}
          {tags.map((t) => (
            <Badge key={t} leftSection={<IconHash size={12} />} variant="light">
              {t}
            </Badge>
          ))}
        </Group>

        <Divider />

        <Stack gap={6}>
          <Text size="xs" c="dimmed" fw={600}>
            Akar Masalah
          </Text>
          <Text size="sm" lh={1.5} lineClamp={3} title={rootCause}>
            {rootCause}
          </Text>
        </Stack>

        <Stack gap={6}>
          <Text size="xs" c="dimmed" fw={600}>
            Solusi / Troubleshoot
          </Text>
          <Text size="sm" lh={1.5} lineClamp={4} title={solution}>
            {solution}
          </Text>
        </Stack>

        <Group justify="end" mt="xs">
          {ticketId && (
            <Button
              component={Link}
              href={`/views/tickets/${encodeURIComponent(ticketId)}`}
              variant="light"
              size="xs"
            >
              Lihat Ticket
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
}
