"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import type {
  BuildType,
  BuilderSelection,
  ComponentCategory,
} from "../model/types";
import { REQUIRED_BY_BUILD, COMPONENT_LABEL } from "../model/types";
import ComponentPicker, { type ComponentPickerValue } from "./ComponentPicker";
import BuildSummary from "./BuildSummary";

const BUILD_OPTIONS: { value: BuildType; label: string }[] = [
  { value: "desktop", label: "Desktop" },
  { value: "server", label: "Server" },
  { value: "iot", label: "IoT" },
];

export default function SystemBuilderPage() {
  const [buildType, setBuildType] = useState<BuildType>("desktop");
  const [preferStore, setPreferStore] = useState(true);

  // selection state per kategori
  const [selection, setSelection] = useState<BuilderSelection>({});

  const requiredCats = useMemo(
    () => (REQUIRED_BY_BUILD[buildType] ?? []) as ComponentCategory[],
    [buildType]
  );

  const updatePick = (cat: ComponentCategory) => (v: ComponentPickerValue) => {
    setSelection((prev) => ({ ...prev, [cat]: v }));
  };

  const resetAll = () => setSelection({});

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Stack gap={2}>
          <Title order={3}>System Builder</Title>
          <Text c="dimmed" size="sm">
            Bangun konfigurasi cepat dari stok toko dan dataset market.
          </Text>
        </Stack>

        <Group wrap="wrap" gap="sm">
          <SegmentedControl
            value={buildType}
            onChange={(v) => setBuildType(v as BuildType)}
            data={BUILD_OPTIONS}
          />
          <Switch
            checked={preferStore}
            onChange={(e) => setPreferStore(e.currentTarget.checked)}
            label="Prefer toko (jika tersedia)"
          />
          <Button variant="default" onClick={resetAll}>
            Reset
          </Button>
          <Button>Simpan Draft</Button>
        </Group>
      </Group>

      <Paper withBorder radius="md" p="md">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Stack gap="lg">
            {/* KOMPONEN WAJIB */}
            <Card withBorder radius="md" p="md">
              <Title order={6} mb="sm">
                Komponen Wajib
              </Title>
              <Stack gap="md">
                {requiredCats.map((cat) => (
                  <ComponentPicker
                    key={cat}
                    category={cat}
                    value={
                      selection[cat] ?? {
                        source: preferStore ? "store" : "market",
                        itemId: null,
                      }
                    }
                    onChange={updatePick(cat)}
                    preferStore={preferStore}
                  />
                ))}
              </Stack>
            </Card>

            {/* KOMPONEN OPSIONAL */}
            <Card withBorder radius="md" p="md">
              <Title order={6} mb="sm">
                Komponen Opsional
              </Title>
              <Stack gap="md">
                {(["cooler", "gpu", "case", "others"] as ComponentCategory[])
                  .filter((cat) => !requiredCats.includes(cat))
                  .map((cat) => (
                    <ComponentPicker
                      key={cat}
                      category={cat}
                      value={
                        selection[cat] ?? {
                          source: preferStore ? "store" : "market",
                          itemId: null,
                        }
                      }
                      onChange={updatePick(cat)}
                      preferStore={preferStore}
                    />
                  ))}
              </Stack>
            </Card>
          </Stack>

          <Stack gap="md">
            <BuildSummary buildType={buildType} selection={selection} />
            <Divider />
            <Text size="sm" c="dimmed">
              Catatan: ini versi UI. Integrasi validasi kompatibilitas (socket,
              TDP, dimensi) dan kalkulasi watt PSU bisa ditambahkan bertahap
              memakai metadata dari dataset market/toko.
            </Text>
          </Stack>
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
