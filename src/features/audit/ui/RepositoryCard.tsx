"use client";

import Link from "next/link";
import {
  Badge,
  Card,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
  Menu,
  ActionIcon,
  rem,
  Anchor,
  Box,
  Button,
} from "@mantine/core";
import {
  IconCalendar,
  IconHash,
  IconDeviceDesktop,
  IconDots,
  IconPencil,
  IconTrash,
  IconEye,
} from "@tabler/icons-react";
import type { User } from "@/features/auth";

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
  currentUser: User | null;
  sourceTeknisiId?: string;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void; // <-- 1. Tambahkan prop onViewDetails
};

export default function RepositoryCard({
  data,
  currentUser,
  sourceTeknisiId,
  onEdit,
  onDelete,
  onViewDetails, // <-- 2. Ambil prop-nya
}: Props) {
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

  const isAdmin =
    currentUser?.role === "Admin" || currentUser?.role === "SysAdmin";
  const isOwner =
    !!currentUser && !!sourceTeknisiId && currentUser.id === sourceTeknisiId;
  const canManage = isAdmin || isOwner;

  const CardContent = (
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
          <Badge leftSection={<IconDeviceDesktop size={14} />} variant="light">
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
    </Stack>
  );

  return (
    <Card withBorder radius="md" p="md">
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* 3. Buat konten kartu bisa diklik & ubah kursor */}
        <Box style={{ flexGrow: 1, cursor: "pointer" }} onClick={onViewDetails}>
          {CardContent}
        </Box>

        {/* Grup Aksi di Bawah (Tombol + Menu) */}
        {(ticketId || canManage) && (
          <Group justify="space-between" mt="md" align="center">
            {/* Tombol "Lihat Tiket" di kiri bawah */}
            <Button
              component={Link}
              href={`/views/tickets/${encodeURIComponent(ticketId!)}`}
              passHref
              size="xs"
              variant="light"
              leftSection={<IconEye size={14} />}
              disabled={!ticketId}
              style={{ visibility: ticketId ? "visible" : "hidden" }}
              // 4. Hentikan event klik agar tidak membuka modal
              onClick={(e) => e.stopPropagation()}
            >
              Lihat Tiket
            </Button>

            {/* Menu Aksi (Edit/Hapus) di kanan bawah */}
            {canManage ? (
              <Menu shadow="md" width={160} withinPortal position="bottom-end">
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    aria-label="Aksi KB"
                    // 5. Hentikan event klik agar tidak membuka modal
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconDots style={{ width: rem(18), height: rem(18) }} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={
                      <IconPencil style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={(e) => {
                      e.stopPropagation(); // Hentikan event
                      onEdit();
                    }}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    leftSection={
                      <IconTrash style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={(e) => {
                      e.stopPropagation(); // Hentikan event
                      onDelete();
                    }}
                  >
                    Hapus
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Box /> // Spacer
            )}
          </Group>
        )}
      </Box>
    </Card>
  );
}
