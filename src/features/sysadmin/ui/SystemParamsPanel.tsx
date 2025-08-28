"use client";

import { useState } from "react";
import {
  Card,
  Group,
  Title,
  Button,
  Stack,
  Select,
  Switch,
  NumberInput,
} from "@mantine/core";
import TextField from "@/shared/ui/inputs/TextField";
import type { SystemParams } from "../model/types";

const DEFAULT_PARAMS: SystemParams = {
  siteName: "I/O SOLUTIONS",
  allowRegistration: true,
  sessionTimeoutMin: 30,
  defaultLocale: "id",
  maintenanceMode: false,
};

export default function SystemParamsPanel() {
  const [params, setParams] = useState<SystemParams>(DEFAULT_PARAMS);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof SystemParams>(
    key: K,
    value: SystemParams[K]
  ) {
    setParams((p) => ({ ...p, [key]: value }));
    setDirty(true);
  }

  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" mb="xs">
        <Title order={5}>Parameter Sistem</Title>
        <Button
          size="xs"
          disabled={!dirty}
          loading={saving}
          onClick={async () => {
            setSaving(true);
            await new Promise((r) => setTimeout(r, 700)); // UI-only
            setSaving(false);
            setDirty(false);
          }}
        >
          Simpan
        </Button>
      </Group>

      <Stack gap="sm">
        <TextField
          label="Nama Sistem"
          placeholder="Nama tampil di header"
          value={params.siteName}
          onChange={(e) => update("siteName", e.currentTarget.value)}
        />

        <Select
          label="Bahasa Default"
          data={[
            { value: "id", label: "Bahasa Indonesia" },
            { value: "en", label: "English" },
          ]}
          value={params.defaultLocale}
          onChange={(v) => update("defaultLocale", (v as any) ?? "id")}
        />

        <NumberInput
          label="Timeout Sesi (menit)"
          min={5}
          max={240}
          value={params.sessionTimeoutMin}
          onChange={(v) => update("sessionTimeoutMin", Number(v) || 0)}
        />

        <Switch
          label="Izinkan pendaftaran pengguna baru"
          checked={params.allowRegistration}
          onChange={(e) => update("allowRegistration", e.currentTarget.checked)}
        />

        <Switch
          color="red"
          label="Mode maintenance"
          checked={params.maintenanceMode}
          onChange={(e) => update("maintenanceMode", e.currentTarget.checked)}
        />
      </Stack>
    </Card>
  );
}
