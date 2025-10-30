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
import { listAudits } from "../api/audits";
import type { AuditLogItem, AuditRecord } from "../model/types";
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

  // [PERBAIKAN PADA 'useQuery']
  const {
    data: auditData,
    isLoading,
    error,
  } = useQuery<Paginated<AuditLogItem>>({
    // 1. QueryKey disederhanakan: kita hanya mengambil 'approved' audits
    queryKey: ["audits", "list", { status: "approved" }],
    queryFn: () =>
      listAudits({
        // 2. Minta status 'approved', karena inilah yang menjadi SOP
        status: "approved",
        // 3. Hapus 'q' dan 'tag'. Kita filter itu di client-side.
        // 4. Set limit tinggi agar kita mendapatkan SEMUA SOP untuk difilter di client
        limit: 500,
      }),
    // 5. Query ini tidak perlu dijalankan ulang saat filter client berubah
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

  const publishedAudits: AuditLogItem[] = auditData?.data ?? [];

  // 'cards' sekarang berisi SEMUA SOP yang 'approved'
  const cards = useMemo<RepositoryCardData[]>(() => {
    return publishedAudits
      .map((a: AuditLogItem) => {
        const allTags = a.tags ?? [];
        return {
          code: a.ticketCode,
          ticketId: a.ticketId,
          // [PERBAIKAN KECIL] Gunakan 'notes' dari audit sebagai rootCause
          subject: a.description ?? `Audit for ${a.ticketCode}`,
          deviceType: inferDeviceFromTags(allTags),
          resolvedAt: formatDateTime(a.at),
          tags: allTags,
          rootCause: a.description ?? "N/A", // Gunakan 'notes' (description)
          solution: "Lihat detail tiket",
        };
      })
      .reverse(); // .reverse() mungkin tidak diperlukan jika sort backend sudah benar
  }, [publishedAudits]);

  // Opsi filter ini sekarang dibuat dari daftar 'cards' yang lengkap
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

  // Logika filter client-side ini SEKARANG AKAN BERFUNGSI DENGAN BENAR
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

  // 'useMemo' kosong ini sepertinya tidak melakukan apa-apa, bisa dihapus
  // useMemo(() => {}, [device, tag, qDebounced]);

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
          placeholder="Kata kunci..."
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
