"use client";

import { Group, Radio, Select, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import type { ComponentCategory, SourceType } from "../model/types";
import { COMPONENT_LABEL } from "../model/types";
import { toSelectData } from "../model/pricing";
import type { Part } from "@/features/inventory/model/types";

export type ComponentPickerValue = {
  source: SourceType;
  itemId: string | null;
};

type Props = {
  category: ComponentCategory;
  value: ComponentPickerValue;
  onChange: (v: ComponentPickerValue) => void;
  preferStore?: boolean;
  storeItems: Part[]; // 3. TAMBAHKAN 'storeItems' SEBAGAI PROP
};

/** Picker per komponen: pilih sumber (Store/Market), lalu pilih item. */
export default function ComponentPicker({
  category,
  value,
  onChange,
  preferStore,
  storeItems,
}: Props) {
  // Data store (Inventory) — filter berdasarkan category (string)
  const storeData = useMemo(() => {
    // Tipe 'p' sekarang otomatis 'Part' (memperbaiki error 'any')
    const list = storeItems.filter(
      (p) => (p.category || "").toLowerCase() === category
    );
    // Tipe 'p' di sini juga 'Part'
    return list.map((p) => ({
      value: p.id,
      label:
        p.price != null
          ? `${p.name} — Rp ${p.price.toLocaleString("id-ID")}`
          : `${p.name} — (harga belum di-set)`,
    }));
  }, [category, storeItems]);

  // Data market
  const marketData = useMemo(
    () => toSelectData([]), // <-- Gunakan array kosong
    [category]
  );

  // Auto switch ke store jika preferStore true & ada item store
  const effectiveSource: SourceType =
    preferStore && storeData.length > 0 ? "store" : value.source;

  const options = effectiveSource === "store" ? storeData : marketData;

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="center">
        <Text fw={600}>{COMPONENT_LABEL[category]}</Text>

        <Radio.Group
          value={effectiveSource}
          onChange={(v) => onChange({ source: v as SourceType, itemId: null })}
        >
          <Group gap="xs">
            <Radio value="store" label="Store" />
            <Radio value="market" label="Market" />
          </Group>
        </Radio.Group>
      </Group>

      <Select
        placeholder={`Pilih ${COMPONENT_LABEL[category]}`}
        data={options}
        searchable
        clearable
        value={value.itemId}
        onChange={(v) => onChange({ source: effectiveSource, itemId: v })}
        nothingFoundMessage="Tidak ada item"
      />
    </Stack>
  );
}
