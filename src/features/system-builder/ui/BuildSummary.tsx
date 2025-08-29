"use client";

import { Alert, Card, Group, List, Text, Title } from "@mantine/core";
import type {
  BuilderSelection,
  BuildType,
  ComponentCategory,
} from "../model/types";
import { COMPONENT_LABEL, REQUIRED_BY_BUILD } from "../model/types";
import { MARKET_ITEMS } from "../model/mock";
import { INVENTORY_ITEMS } from "@/features/inventory/model/mock";
import { idr, sum } from "../model/pricing";

function getPriceFromSelection(
  cat: ComponentCategory,
  sel: BuilderSelection
): number | null {
  const pick = sel[cat];
  if (!pick || !pick.itemId) return null;

  if (pick.source === "market") {
    const item = MARKET_ITEMS.find((m) => m.id === pick.itemId);
    return item?.price ?? null;
  }
  const store = INVENTORY_ITEMS.find((p) => p.id === pick.itemId);
  return store?.price ?? null;
}

export default function BuildSummary({
  buildType,
  selection,
}: {
  buildType: BuildType;
  selection: BuilderSelection;
}) {
  const required = REQUIRED_BY_BUILD[buildType] ?? [];
  const missing = required.filter((cat) => !selection[cat]?.itemId);

  const prices = required.map((cat) => getPriceFromSelection(cat, selection));
  const total = sum(prices);

  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" mb="sm">
        <Title order={5}>Ringkasan</Title>
        <Text fw={700}>{idr(total)}</Text>
      </Group>

      {missing.length > 0 ? (
        <Alert color="yellow" title="Komponen wajib belum lengkap" mb="xs">
          <List spacing={2}>
            {missing.map((m) => (
              <List.Item key={m}>{COMPONENT_LABEL[m]}</List.Item>
            ))}
          </List>
        </Alert>
      ) : (
        <Alert color="green" title="Konfigurasi lengkap" mb="xs">
          Siap disimpan atau dibuat Work Order.
        </Alert>
      )}

      <List spacing={4}>
        {required.map((cat) => {
          const pick = selection[cat];
          if (!pick?.itemId) {
            return (
              <List.Item key={cat}>
                <Text c="dimmed">{COMPONENT_LABEL[cat]}: —</Text>
              </List.Item>
            );
          }
          const label =
            pick.source === "market"
              ? MARKET_ITEMS.find((m) => m.id === pick.itemId)?.name
              : INVENTORY_ITEMS.find((p) => p.id === pick.itemId)?.name;

          const price = getPriceFromSelection(cat, selection);

          return (
            <List.Item key={cat}>
              <Text>
                {COMPONENT_LABEL[cat]}: {label ?? "—"}{" "}
                <Text span c="dimmed">
                  ({pick.source})
                </Text>{" "}
                <Text span fw={600}>
                  {price != null ? idr(price) : "—"}
                </Text>
              </Text>
            </List.Item>
          );
        })}
      </List>
    </Card>
  );
}
