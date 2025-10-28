"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type {
  BuilderSelection,
  ComponentCategory,
  BuildId,
} from "../model/types";
import { REQUIRED_BY_SYSTEM } from "../model/types";
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
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { Part } from "@/features/inventory/model/types";
import { LoadingOverlay } from "@mantine/core";

const toNum = (v: any, fb = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};

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
  const [preferStore] = useState(true);
  const [budget, setBudget] = useState<number | "">("");
  const [selection, setSelection] = useState<BuilderSelection>({});

  const { data: storeItems = [], isLoading: isLoadingStore } = useQuery<Part[]>(
    {
      queryKey: ["parts", "list", "forBuilder"],
      queryFn: async () => {
        // Kita asumsikan API parts mengembalikan { data: [...] }
        const res = await apiClient.get("/parts");
        return res.data?.data || [];
      },
    }
  );

  const requiredCats = useMemo(
    () => (REQUIRED_BY_SYSTEM[systemId] ?? []) as ComponentCategory[],
    [systemId]
  );

  const updatePick = (cat: ComponentCategory) => (v: ComponentPickerValue) => {
    setSelection((prev) => ({ ...prev, [cat]: v }));
  };

  const resetAll = () => setSelection({});

  const storePriceMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const it of storeItems) {
      // <-- Ganti INVENTORY_ITEMS
      const id = String(it?.id ?? ""); // <-- Gunakan 'id'
      if (!id) continue;
      const price = toNum(it?.price ?? 0);
      m.set(id, price);
    }
    return m;
  }, [storeItems]); // <-- Tambah dependensi storeItems

  const marketPriceMap = useMemo(() => {
    return new Map<string, number>();
  }, []);

  function getPrice(val: ComponentPickerValue): number {
    if (!val) return 0;

    const override = (val as any)?.overridePrice ?? (val as any)?.price;
    if (override != null) return toNum(override);

    const itemId = val.itemId ? String(val.itemId) : null;
    if (!itemId) return 0;

    if (val.source === "store") {
      return storePriceMap.get(itemId) ?? 0;
    }
    if (val.source === "market") {
      return marketPriceMap.get(itemId) ?? 0;
    }
    return 0;
  }

  const grandTotal = useMemo(() => {
    let sum = 0;
    for (const [, val] of Object.entries(selection) as [
      ComponentCategory,
      ComponentPickerValue
    ][]) {
      if (
        !val?.itemId &&
        (val as any)?.price == null &&
        (val as any)?.overridePrice == null
      ) {
        continue;
      }
      const qty = Math.max(1, toNum((val as any)?.qty ?? 1));
      sum += getPrice(val) * qty;
    }
    return sum;
  }, [selection, storePriceMap, marketPriceMap]);

  const numericBudget = typeof budget === "number" ? budget : 0;
  const remaining = numericBudget - grandTotal;
  const isOver = remaining < 0;

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
          <Button variant="default" onClick={resetAll}>
            Reset
          </Button>
          <Button>Simpan Draft</Button>
        </Group>
      </Group>

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

      <Paper withBorder radius="md" p="md" style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoadingStore} />
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Stack gap="lg">
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
                    storeItems={storeItems}
                  />
                ))}
              </Stack>
            </Card>

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
                      storeItems={storeItems}
                    />
                  ))}
              </Stack>
            </Card>
          </Stack>

          <Stack gap="md">
            <Card withBorder radius="md" p="md">
              <Title order={6} mb="xs">
                Budget Pelanggan
              </Title>
              <NumberInput
                label="Budget (Rp)"
                hideControls
                min={0}
                value={budget}
                onChange={(v) => setBudget(typeof v === "number" ? v : "")}
                w="100%"
              />
              <Text size="xs" c="dimmed" mt="xs">
                Tentukan anggaran agar total komponen selaras dengan ekspektasi
                pelanggan.
              </Text>
            </Card>

            <Card withBorder radius="md" p="md">
              <Group justify="space-between" align="center" mb="xs">
                <Title order={6}>Ringkasan Budget</Title>
                <Badge color={isOver ? "red" : "teal"} variant="light">
                  {isOver ? "Defisit" : "Sisa"}
                </Badge>
              </Group>

              <Stack gap={6}>
                <Group justify="space-between">
                  <Text c="dimmed">Budget</Text>
                  <Text fw={600}>{numericBudget.toLocaleString("id-ID")}</Text>
                </Group>
                <Group justify="space-between">
                  <Text c="dimmed">Perkiraan total</Text>
                  <Text fw={600}>{grandTotal.toLocaleString("id-ID")}</Text>
                </Group>
                <Divider my="xs" />
                <Group justify="space-between">
                  <Text c="dimmed">{isOver ? "Defisit" : "Sisa budget"}</Text>
                  <Text fw={700} c={isOver ? "red" : "teal"}>
                    {Math.abs(remaining).toLocaleString("id-ID")}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  Total menjumlahkan semua komponen yang dipilih (wajib &
                  opsional). Item sumber <em>market</em> ikut terhitung bila
                  komponen mengisi harga (<code>price</code>/
                  <code>overridePrice</code>); jika tidak, sementara 0.
                </Text>
              </Stack>
            </Card>

            <BuildSummary
              systemId={systemId}
              selection={selection}
              storeItems={storeItems}
            />

            <Divider />
            <Text size="sm" c="dimmed">
              Nanti kita tambahkan validasi kompatibilitas (socket, TDP, form
              factor) dan rekomendasi PSU otomatis.
            </Text>
          </Stack>
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
