"use client";

import { Card, Group, Title } from "@mantine/core";
import {
  IconDatabase,
  IconRecycle,
  IconBolt,
  IconShieldLock,
} from "@tabler/icons-react";
import ActionButton from "@/shared/ui/buttons/ActionButton";

export default function QuickActions() {
  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" mb="xs">
        <Title order={5}>Aksi Cepat</Title>
      </Group>

      <Group wrap="wrap" gap="sm">
        <ActionButton
          leftSection={<IconDatabase size={16} />}
          variant="default"
          confirm={{
            title: "Backup sekarang?",
            message: "Proses akan berjalan di background.",
          }}
        >
          Backup
        </ActionButton>

        <ActionButton
          leftSection={<IconRecycle size={16} />}
          variant="default"
          confirm={{
            title: "Reindex?",
            message: "Dapat memakan waktu beberapa menit.",
          }}
        >
          Reindex
        </ActionButton>

        <ActionButton
          leftSection={<IconBolt size={16} />}
          color="mono.8"
          confirm={{
            title: "Flush cache?",
            message: "Cache aplikasi akan dibersihkan.",
          }}
        >
          Flush Cache
        </ActionButton>

        <ActionButton
          leftSection={<IconShieldLock size={16} />}
          color="red"
          confirm={{
            title: "Masuk mode maintenance?",
            message: "Pengguna akhir akan dibatasi.",
          }}
        >
          Maintenance
        </ActionButton>
      </Group>
    </Card>
  );
}
