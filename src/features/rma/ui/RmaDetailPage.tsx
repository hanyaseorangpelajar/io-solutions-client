"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ActionIcon,
  Alert,
  Badge,
  Group,
  List,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import RmaStatusBadge from "./RmaStatusBadge";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { RmaRecord, RmaAction } from "../model/types";

function dt(v: string | Date) {
  const d = typeof v === "string" ? new Date(v) : v;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default function RmaDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id ?? "");

  const {
    data: rma,
    isLoading,
    error,
  } = useQuery<RmaRecord>({
    queryKey: ["rma", "detail", id],
    queryFn: async () => {
      const res = await apiClient.get<RmaRecord>(`/rma/${id}`); // Tambahkan tipe data yang diharapkan
      // BENAR: Kembalikan data respons secara langsung
      return res.data;
    },
    enabled: !!id,
  });

  const closeDetail = () => {
    if (typeof window !== "undefined" && window.history.length > 1)
      router.back();
    else router.push("/misc/rma");
  };

  if (isLoading) {
    return (
      <Paper
        withBorder
        p="lg"
        radius="md"
        style={{ position: "relative", minHeight: 200 }}
      >
        <LoadingOverlay visible />
      </Paper>
    );
  }

  if (error || !rma) {
    return (
      <Paper withBorder p="lg" radius="md">
        <Group justify="space-between" mb="sm">
          <Title order={3}>RMA</Title>
          <Tooltip label="Tutup detail">
            <ActionIcon
              variant="light"
              radius="xl"
              onClick={closeDetail}
              aria-label="Tutup"
            >
              <IconX size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Alert
          color="red"
          icon={<IconAlertTriangle />}
          title="Gagal Memuat Data"
        >
          {error ? (error as Error).message : "Data RMA tidak ditemukan."}
        </Alert>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Stack gap={4}>
          <Group gap="xs">
            <Title order={3} style={{ lineHeight: 1.15 }}>
              {rma.code}
            </Title>
            <RmaStatusBadge status={rma.status} />
          </Group>
          <Text c="dimmed">{rma.title}</Text>
        </Stack>
        <Tooltip label="Tutup detail">
          <ActionIcon
            variant="light"
            radius="xl"
            onClick={closeDetail}
            aria-label="Tutup"
          >
            <IconX size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Paper withBorder radius="md" p="md">
        <Group gap="xl">
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Pelanggan
            </Text>
            <Text fw={600}>{rma.customerName}</Text>
            {rma.contact ? <Text c="dimmed">{rma.contact}</Text> : null}
          </Stack>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Produk
            </Text>
            <Text fw={600}>
              {rma.productName}{" "}
              {rma.productSku ? (
                <Badge variant="light">{rma.productSku}</Badge>
              ) : null}
            </Text>
          </Stack>
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Garansi
            </Text>
            <Text>
              {rma.warranty.warrantyMonths ?? "—"} bulan
              {rma.warranty.purchaseDate
                ? `, beli ${dt(rma.warranty.purchaseDate)}`
                : ""}
            </Text>
            {rma.warranty.serial ? (
              <Text c="dimmed">SN: {rma.warranty.serial}</Text>
            ) : null}
            {rma.warranty.vendor ? (
              <Text c="dimmed">Vendor: {rma.warranty.vendor}</Text>
            ) : null}
          </Stack>
        </Group>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Text fw={700} mb="xs">
          Timeline
        </Text>
        <List spacing={6}>
          {rma.actions.map((a: RmaAction) => (
            <List.Item key={a.id ?? a.at}>
              <Text>
                <Text span fw={600}>
                  {dt(a.at)}
                </Text>{" "}
                — <Text span>{a.type}</Text>
                {a.note ? (
                  <>
                    {" "}
                    —{" "}
                    <Text span c="dimmed">
                      {a.note}
                    </Text>
                  </>
                ) : null}
              </Text>
            </List.Item>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}
