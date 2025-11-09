"use client";

import { useAuth } from "@/features/auth";
import { useModals } from "@mantine/modals";
import type { Paginated } from "@/features/tickets/api/tickets";
import { formatDateTime } from "@/features/tickets/utils/format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

import {
  listKBSolutions,
  updateKBEntry,
  deleteKBEntry,
  type KBEntryBackend,
  type KBEntryUpdateInput,
} from "../api/audits";

import RepositoryCard, { type RepositoryCardData } from "./RepositoryCard";
import KBEntryEditModal from "./KBEntryEditModal";
import RepositoryDetailModal from "./RepositoryDetailModal";

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const modals = useModals();
  const [device, setDevice] = useState<string | "all">("all");
  const [tag, setTag] = useState<string | "all">("all");
  const [q, setQ] = useState("");
  const [qDebounced] = useDebouncedValue(q.trim().toLowerCase(), 250);

  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);
  const [editingEntry, setEditingEntry] = useState<KBEntryBackend | null>(null);

  const [viewingEntryData, setViewingEntryData] =
    useState<RepositoryCardData | null>(null);

  const {
    data: kbData,
    isLoading,
    error,
    refetch,
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

  const mappedCardData = useMemo(() => {
    const cardDataMap = new Map<string, RepositoryCardData>();
    for (const kb of allEntries) {
      const allTags = (kb.tags ?? []).map((t) => t.nama);
      cardDataMap.set(kb.id, {
        code: kb.sourceTicketId.nomorTiket,
        ticketId: kb.sourceTicketId._id,
        subject: kb.gejala,
        deviceType: inferDeviceFromTags(allTags),
        resolvedAt: formatDateTime(kb.dibuatPada),
        tags: allTags,
        rootCause: kb.diagnosis,
        solution: kb.solusi,
      });
    }
    return cardDataMap;
  }, [allEntries]);

  const deviceOptions = useMemo(() => {
    const devices = new Set(
      Array.from(mappedCardData.values())
        .map((c) => c.deviceType)
        .filter((d): d is string => !!d)
    );
    return [
      { value: "all", label: "Semua Perangkat" },
      ...Array.from(devices)
        .sort()
        .map((d) => ({ value: d, label: d })),
    ];
  }, [mappedCardData]);

  const tagOptions = useMemo(() => {
    const tags = new Set(
      Array.from(mappedCardData.values()).flatMap((c) => c.tags ?? [])
    );
    return [
      { value: "all", label: "Semua Tag" },
      ...Array.from(tags)
        .sort()
        .map((t) => ({ value: t, label: t })),
    ];
  }, [mappedCardData]);

  const filteredEntries = useMemo(() => {
    return allEntries.filter((kb) => {
      const cardData = mappedCardData.get(kb.id);
      if (!cardData) return false;

      const byDevice = device === "all" || cardData.deviceType === device;
      const byTag = tag === "all" || cardData.tags.includes(tag);
      const byQuery = () => {
        if (!qDebounced) return true;
        const hay = `${cardData.subject} ${cardData.code} ${
          cardData.rootCause
        } ${cardData.solution} ${cardData.tags.join(" ")}`.toLowerCase();
        return hay.includes(qDebounced);
      };

      return byDevice && byTag && byQuery();
    });
  }, [allEntries, mappedCardData, device, tag, qDebounced]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: KBEntryUpdateInput }) =>
      updateKBEntry(id, data),
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Sukses",
        message: "Entri Knowledge Base telah diperbarui.",
      });
      refetch();
      setEditingEntry(null);
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Memperbarui",
        message: e.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteKBEntry,
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Sukses",
        message: "Entri Knowledge Base telah dihapus.",
      });
      refetch();
    },
    onError: (e: any) => {
      notifications.show({
        color: "red",
        title: "Gagal Menghapus",
        message: e.message,
      });
    },
  });

  const openDeleteModal = (entry: KBEntryBackend) => {
    modals.openConfirmModal({
      title: "Hapus Entri KB",
      centered: true,
      children: (
        <Text size="sm">
          Apakah Anda yakin ingin menghapus entri untuk:{" "}
          <strong>{entry.gejala}</strong>? Tindakan ini tidak dapat dibatalkan.
        </Text>
      ),
      labels: { confirm: "Hapus", cancel: "Batal" },
      confirmProps: { color: "red", loading: deleteMutation.isPending },
      onConfirm: () => deleteMutation.mutate(entry.id),
    });
  };

  const visibleEntries = filteredEntries.slice(0, page * PAGE_SIZE);
  const canLoadMore = visibleEntries.length < filteredEntries.length;

  const clearFilters = () => {
    setQ("");
    setDevice("all");
    setTag("all");
    setPage(1);
  };

  return (
    <Stack gap="md" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading || deleteMutation.isPending} />

      <Group justify="space-between" align="center">
        <Title order={3}>Repository (SOP Library)</Title>
        <Text size="sm" c="dimmed">
          {filteredEntries.length} entri ditemukan
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
        {visibleEntries.map((kb) => {
          const cardData = mappedCardData.get(kb.id);
          if (!cardData) return null;

          return (
            <RepositoryCard
              key={kb.id}
              data={cardData}
              currentUser={user}
              sourceTeknisiId={kb.sourceTicketId?.teknisiId}
              onViewDetails={() => setViewingEntryData(cardData)}
              onEdit={() => setEditingEntry(kb)}
              onDelete={() => openDeleteModal(kb)}
            />
          );
        })}
      </SimpleGrid>

      {filteredEntries.length === 0 && !isLoading && (
        <Text c="dimmed" ta="center" py="xl">
          Tidak ada entri SOP yang cocok ditemukan.
        </Text>
      )}

      {canLoadMore && (
        <Group justify="center" mt="md">
          <Button variant="light" onClick={() => setPage((p) => p + 1)}>
            Muat lebih banyak ({filteredEntries.length - visibleEntries.length}{" "}
            tersisa)
          </Button>
        </Group>
      )}

      <KBEntryEditModal
        opened={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        entry={editingEntry}
        isSubmitting={updateMutation.isPending}
        onSubmit={async (data) => {
          if (editingEntry) {
            await updateMutation.mutateAsync({ id: editingEntry.id, data });
          }
        }}
      />

      <RepositoryDetailModal
        opened={!!viewingEntryData}
        onClose={() => setViewingEntryData(null)}
        data={viewingEntryData}
      />
    </Stack>
  );
}
