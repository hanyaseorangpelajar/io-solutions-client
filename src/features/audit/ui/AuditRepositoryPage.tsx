"use client";

import type { Paginated } from "@/features/tickets/api/tickets";
import { formatDateTime } from "@/features/tickets/utils/format";
import TextField from "@/shared/ui/inputs/TextField";
import {
  Button,
  Group,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { listKBSolutions, type KBEntryBackend } from "../api/audits";

import RepositoryCard, { type RepositoryCardData } from "./RepositoryCard";

function inferDeviceFromTags(tags: string[]): string | undefined {
  if (!Array.isArray(tags)) return undefined;
  const lowerTags = tags.map((t) => t.toLowerCase());
  if (lowerTags.includes("laptop")) return "Laptop";
  if (lowerTags.includes("pc") || lowerTags.includes("desktop"))
    return "PC Desktop";
  if (lowerTags.includes("printer")) return "Printer";
  return undefined;
}

export default function AuditRepositoryPage() {
  const [device, setDevice] = useState<string | "all">("all");
  const [tag, setTag] = useState<string | "all">("all");
  const [q, setQ] = useState("");
  const [qDebounced] = useDebouncedValue(q.trim().toLowerCase(), 250);

  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);

  const {
    data: kbData,
    isLoading,
    error,
  } = useQuery<Paginated<KBEntryBackend>>({
    queryKey: ["kb-entry", "list"],
    queryFn: () => listKBSolutions({}),
  });

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        title: "Gagal memuat repository",
        message: (error as Error).message,
      });
    }
  }, [error]);

  const allEntries: KBEntryBackend[] = kbData?.data ?? [];

  const cards = useMemo<RepositoryCardData[]>(() => {
    return allEntries
      .map((kb: KBEntryBackend) => {
        const allTags = (kb.tags ?? []).map((t) => t.nama);

        return {
          code: kb.sourceTicketId?.nomorTiket ?? "N/A",
          ticketId: kb.sourceTicketId?._id ?? null,
          subject: kb.gejala,
          deviceType: inferDeviceFromTags(allTags),
          resolvedAt: formatDateTime(kb.dibuatPada),
          tags: allTags,
          rootCause: kb.diagnosis,
          solution: kb.solusi,
        };
      })
      .reverse();
  }, [allEntries]);

  const deviceOptions = useMemo(() => {
    const devices = new Set(
      cards.map((c) => c.deviceType).filter((d): d is string => !!d)
    );
    return [
      { value: "all", label: "Semua Perangkat" },
      ...Array.from(devices)
        .sort()
        .map((d) => ({ value: d, label: d })),
    ];
  }, [cards]);
  const tagOptions = useMemo(() => {
    const tags = new Set(cards.flatMap((c) => c.tags ?? []));
    return [
      { value: "all", label: "Semua Tag" },
      ...Array.from(tags)
        .sort()
        .map((t) => ({ value: t, label: t })),
    ];
  }, [cards]);

  const filtered = useMemo(() => {
    const byDevice = (c: RepositoryCardData) =>
      device === "all" || c.deviceType === device;
    const byTag = (c: RepositoryCardData) =>
      tag === "all" || c.tags.includes(tag);
    const byQuery = (c: RepositoryCardData) => {
      if (!qDebounced) return true;
      const hay = `${c.subject} ${c.code} ${c.rootCause} ${
        c.solution
      } ${c.tags.join(" ")}`.toLowerCase();
      return hay.includes(qDebounced);
    };
    return cards.filter((c) => byDevice(c) && byTag(c) && byQuery(c));
  }, [cards, device, tag, qDebounced]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const canLoadMore = visible.length < filtered.length;
  const clearFilters = () => {
    setQ("");
    setDevice("all");
    setTag("all");
    setPage(1);
  };

  return (
    <Stack gap="md" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} />

      <Group justify="space-between" align="center">
        <Title order={3}>Repository (SOP Library)</Title>
        <Text size="sm" c="dimmed">
          {filtered.length} entri ditemukan
        </Text>
      </Group>

      <Group gap="sm" align="end" wrap="wrap">
        <TextField
          label="Cari SOP"
          placeholder="Gejala, Diagnosis, Solusi..."
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          style={{ flexGrow: 1, minWidth: 250 }}
        />
        <Select
          label="Perangkat"
          data={deviceOptions}
          value={device}
          onChange={(v) => setDevice(v ?? "all")}
          style={{ minWidth: 180 }}
        />
        <Select
          label="Tag"
          data={tagOptions}
          value={tag}
          onChange={(v) => setTag(v ?? "all")}
          searchable
          style={{ minWidth: 180 }}
        />
        <Button variant="subtle" onClick={clearFilters}>
          Reset Filter
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {visible.map((cardData) => (
          <RepositoryCard
            key={cardData.ticketId ?? cardData.code}
            data={cardData}
          />
        ))}
      </SimpleGrid>

      {filtered.length === 0 && !isLoading && (
        <Text c="dimmed" ta="center" py="xl">
          Tidak ada entri SOP yang cocok ditemukan.
        </Text>
      )}

      {canLoadMore && (
        <Group justify="center" mt="md">
          <Button variant="light" onClick={() => setPage((p) => p + 1)}>
            Muat lebih banyak ({filtered.length - visible.length} tersisa)
          </Button>
        </Group>
      )}
    </Stack>
  );
}
