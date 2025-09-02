"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { AUDITS } from "../model/mock";
import { MOCK_TICKETS } from "@/features/tickets/model/mock";
import { formatDateTime } from "@/features/tickets/utils/format";
import RepositoryCard, { type RepositoryCardData } from "./RepositoryCard";
import TextField from "@/shared/ui/inputs/TextField";

/** Heuristik sederhana menebak jenis device dari tag */
function inferDeviceFromTags(tags: string[]): string | undefined {
  const t = tags.map((x) => x.toLowerCase());
  if (t.includes("laptop")) return "Laptop";
  if (t.includes("desktop") || t.includes("pc")) return "Desktop";
  if (t.includes("monitor") || t.includes("display")) return "Monitor";
  if (t.includes("printer")) return "Printer";
  if (t.includes("network")) return "Network";
  if (t.includes("software")) return "Software";
  return undefined;
}

export default function AuditRepositoryPage() {
  // Filters
  const [device, setDevice] = useState<string | "all">("all");
  const [tag, setTag] = useState<string | "all">("all");
  const [q, setQ] = useState("");
  const [qDebounced] = useDebouncedValue(q.trim().toLowerCase(), 250);

  // Pagination
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);

  // Ambil audits yang published, gabungkan dengan ticket resolusinya
  const cards = useMemo<RepositoryCardData[]>(() => {
    const list: RepositoryCardData[] = [];
    for (const a of AUDITS) {
      if (!a.publish) continue;
      const t = MOCK_TICKETS.find((x) => x.id === a.ticketId);
      if (!t?.resolution) continue;

      const allTags = a.tags?.length ? a.tags : t.resolution.tags ?? [];
      list.push({
        code: a.ticketCode,
        ticketId: a.ticketId,
        subject: t.subject ?? a.ticketCode,
        deviceType: inferDeviceFromTags(allTags),
        resolvedAt: formatDateTime(t.resolution.resolvedAt),
        tags: allTags,
        rootCause: t.resolution.rootCause,
        solution: t.resolution.solution,
        cover: t.resolution.photos?.[0],
      });
    }
    // terbaru di atas
    return list.reverse();
  }, []);

  // derive opsi filter dari data
  const deviceOptions = useMemo(() => {
    const s = new Set(
      cards.map((c) => c.deviceType).filter(Boolean) as string[]
    );
    return [
      { value: "all", label: "Semua device" },
      ...Array.from(s).map((v) => ({ value: v, label: v })),
    ];
  }, [cards]);

  const tagOptions = useMemo(() => {
    const s = new Set(cards.flatMap((c) => c.tags));
    return [
      { value: "all", label: "Semua tag" },
      ...Array.from(s).map((v) => ({ value: v, label: `#${v}` })),
    ];
  }, [cards]);

  // Filter + search
  const filtered = useMemo(() => {
    const byDevice = (c: RepositoryCardData) =>
      device === "all" ? true : c.deviceType === device;
    const byTag = (c: RepositoryCardData) =>
      tag === "all" ? true : c.tags.includes(tag);
    const byQuery = (c: RepositoryCardData) => {
      if (!qDebounced) return true;
      const hay = `${c.subject} ${c.rootCause} ${c.solution} ${c.tags.join(
        " "
      )}`.toLowerCase();
      return hay.includes(qDebounced);
    };
    const arr = cards.filter((c) => byDevice(c) && byTag(c) && byQuery(c));
    return arr;
  }, [cards, device, tag, qDebounced]);

  // reset page saat filter berubah
  const [filtersKey, setFiltersKey] = useState(0);
  useMemo(() => {
    setPage(1);
    setFiltersKey((k) => k + 1); // trigger re-render key if needed
  }, [device, tag, qDebounced]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const canLoadMore = visible.length < filtered.length;

  const clearFilters = () => {
    setDevice("all");
    setTag("all");
    setQ("");
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>Repository (SOP Library)</Title>
        <Text size="sm" c="dimmed">
          {filtered.length} entri
        </Text>
      </Group>

      {/* Toolbar filter */}
      <Group gap="sm" align="end" wrap="wrap">
        <TextField
          label="Cari"
          placeholder="Cari subject / akar masalah / solusi / tag"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ minWidth: 280 }}
        />
        <Select
          label="Jenis device"
          data={deviceOptions}
          value={device}
          onChange={(v) => setDevice((v as any) ?? "all")}
          style={{ minWidth: 200 }}
          searchable
          clearable={false}
        />
        <Select
          label="Tag"
          data={tagOptions}
          value={tag}
          onChange={(v) => setTag((v as any) ?? "all")}
          style={{ minWidth: 200 }}
          searchable
          clearable={false}
        />
        <Button variant="subtle" onClick={clearFilters}>
          Reset filter
        </Button>
      </Group>

      {/* Grid of cards */}
      <SimpleGrid
        key={filtersKey}
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing="md"
      >
        {visible.map((c) => (
          <RepositoryCard key={`${c.code}-${c.ticketId}`} data={c} />
        ))}
      </SimpleGrid>

      {filtered.length === 0 && (
        <Text c="dimmed" size="sm">
          Tidak ada entri yang cocok dengan filter/pencarian.
        </Text>
      )}

      {canLoadMore && (
        <Group justify="center" mt="sm">
          <Button variant="light" onClick={() => setPage((p) => p + 1)}>
            Muat lebih
          </Button>
        </Group>
      )}
    </Stack>
  );
}
