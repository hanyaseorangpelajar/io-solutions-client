"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import type {
  BuilderSelection,
  ComponentCategory,
  BuildId,
} from "../model/types";
import { REQUIRED_BY_SYSTEM, COMPONENT_LABEL } from "../model/types";
import ComponentPicker, { type ComponentPickerValue } from "./ComponentPicker";
import BuildSummary from "./BuildSummary";
import SystemTypeCard from "./SystemTypeCard";
import {
  IconCpu,
  IconServer,
  IconCircuitBattery,
  IconTopologyRing3,
  IconRouter,
} from "@tabler/icons-react";

// Katalog sistem (bisa tambah kapan saja tanpa sentuh tipe)
const SYSTEMS: {
  id: BuildId;
  label: string;
  desc: string;
  icon: React.ReactNode;
  tags?: string[];
}[] = [
  {
    id: "desktop",
    label: "Desktop",
    desc: "PC kerja/rumah umum. Fokus price-performance.",
    icon: <IconCpu size={20} />,
    tags: ["office", "general"],
  },
  {
    id: "server",
    label: "Server",
    desc: "Server/NAS/home lab. Stabil & expandability.",
    icon: <IconServer size={20} />,
    tags: ["24/7", "ECC?"],
  },
  {
    id: "iot",
    label: "IoT / Edge",
    desc: "Node sensor, gateway, perangkat embedded.",
    icon: <IconCircuitBattery size={20} />,
    tags: ["low-power", "compact"],
  },

  // Contoh tambahan ke depan (ID bebas string):
  {
    id: "router-ap" as BuildId,
    label: "Router/AP",
    desc: "Router, access point, NVRAM rendah.",
    icon: <IconRouter size={20} />,
    tags: ["network"],
  },
  {
    id: "mini-lab" as BuildId,
    label: "Mini Home Lab",
    desc: "Cluster kecil VM/kontenainer.",
    icon: <IconTopologyRing3 size={20} />,
    tags: ["virtualization"],
  },
];

export default function SystemBuilderPage() {
  const [systemId, setSystemId] = useState<BuildId>("desktop");
  const [preferStore, setPreferStore] = useState(true);

  // selection state per kategori
  const [selection, setSelection] = useState<BuilderSelection>({});

  const requiredCats = useMemo(
    () => (REQUIRED_BY_SYSTEM[systemId] ?? []) as ComponentCategory[],
    [systemId]
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
            Bangun konfigurasi dari stok toko dan dataset market. Pilih tipe
            sistem di bawah.
          </Text>
        </Stack>

        <Group wrap="wrap" gap="sm">
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

      {/* Grid pilihan sistem */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {SYSTEMS.map((s) => (
          <SystemTypeCard
            key={s.id}
            id={s.id}
            label={s.label}
            description={s.desc}
            icon={s.icon}
            tags={s.tags}
            selected={s.id === systemId}
            onSelect={(id) => setSystemId(id as BuildId)}
          />
        ))}
      </SimpleGrid>

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
            <BuildSummary systemId={systemId} selection={selection} />
            <Divider />
            <Text size="sm" c="dimmed">
              Catatan: ini versi UI. Validasi kompatibilitas (socket, TDP, form
              factor) & kalkulasi kebutuhan PSU bisa ditambahkan memakai
              metadata dataset.
            </Text>
          </Stack>
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
