// File: features/audit/ui/AuditRepositoryPage.tsx

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

// --- PERUBAHAN 1: Impor API dan Tipe baru ---
import { listKBSolutions, type KBEntryBackend } from "../api/audits";
// Hapus tipe AuditLogItem
// import type { AuditLogItem, AuditRecord } from "../model/types";
// --- AKHIR PERUBAHAN 1 ---

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

  // --- PERUBAHAN 2: Ganti useQuery ---
  const {
    data: kbData, // Ganti nama data
    isLoading,
    error,
  } = useQuery<Paginated<KBEntryBackend>>({
    // Ganti queryKey
    queryKey: ["kb-entry", "list"],
    // Ganti queryFn
    queryFn: () => listKBSolutions({}),
    // Hapus 'limit: 500' karena API backend akan mengembalikan semua
  });
  // --- AKHIR PERUBAHAN 2 ---

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

  // --- PERUBAHAN 3: Perbarui logika 'useMemo' (mapping data) ---
  const cards = useMemo<RepositoryCardData[]>(() => {
    return allEntries
      .map((kb: KBEntryBackend) => {
        // 'tags' dari backend adalah objek, ubah jadi string
        const allTags = (kb.tags ?? []).map((t) => t.nama);

        return {
          code: kb.sourceTicketId?.nomorTiket ?? "N/A",
          ticketId: kb.sourceTicketId?._id ?? kb.id, // Fallback ke ID KB jika tiket tidak ada
          subject: kb.gejala, // 'gejala' sebagai 'subject'
          deviceType: inferDeviceFromTags(allTags), // Tetap gunakan infer
          resolvedAt: formatDateTime(kb.dibuatPada), // Gunakan tanggal KB
          tags: allTags,
          rootCause: kb.diagnosis, // 'diagnosis' sebagai 'rootCause'
          solution: kb.solusi, // 'solusi' sebagai 'solution'
        };
      })
      .reverse();
  }, [allEntries]);
  // --- AKHIR PERUBAHAN 3 ---

  // Opsi filter (tetap sama, mengandalkan data 'cards' yang sudah di-map)
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

  // Logika filter (tetap sama)
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
          placeholder="Gejala, Diagnosis, Solusi..." // Perbarui placeholder
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
          <RepositoryCard key={cardData.ticketId} data={cardData} />
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
