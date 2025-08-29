"use client";

import { Group, Radio, Select, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import type { ComponentCategory, SourceType } from "../model/types";
import { COMPONENT_LABEL } from "../model/types";
import { toSelectData } from "../model/pricing";
import { marketByCategory } from "../model/mock";
import { INVENTORY_ITEMS } from "@/features/inventory/model/mock";

export type ComponentPickerValue = {
  source: SourceType;
  itemId: string | null;
};

type Props = {
  category: ComponentCategory;
  value: ComponentPickerValue;
  onChange: (v: ComponentPickerValue) => void;
  preferStore?: boolean;
};

/** Picker per komponen: pilih sumber (Store/Market), lalu pilih item. */
export default function ComponentPicker({
  category,
  value,
  onChange,
  preferStore,
}: Props) {
  // Data store (Inventory) — filter berdasarkan category (string)
  const storeData = useMemo(() => {
    // asumsi Inventory Part.category seragam (contoh: "cpu") — kalau berbeda, map-kan di sini
    const list = INVENTORY_ITEMS.filter(
      (p) => (p.category || "").toLowerCase() === category
    );
    return list.map((p) => ({
      value: p.id,
      label:
        p.price != null
          ? `${p.name} — Rp ${p.price.toLocaleString("id-ID")}`
          : `${p.name} — (harga belum di-set)`,
    }));
  }, [category]);

  // Data market
  const marketData = useMemo(
    () => toSelectData(marketByCategory(category)),
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
