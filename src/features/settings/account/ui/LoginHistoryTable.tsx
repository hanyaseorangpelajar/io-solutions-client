"use client";

import { Paper, Table, Text, Badge } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

type LoginEvent = {
  id?: string;
  _id?: string;
  createdAt?: string;
  time?: string;
  loggedAt?: string;
  ip?: string;
  ipAddress?: string;
  userAgent?: string;
  device?: string;
  success?: boolean;
  ok?: boolean;
  status?: string;
};

export default function LoginHistoryTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me", "login-history"],
    // GANTI path ini jika backend-mu beda (mis. "/users/me/login-history" atau "/auth/sessions")
    queryFn: () =>
      apiClient.get("/auth/login-history", { params: { limit: 10 } }),
    select: (res: any): LoginEvent[] => res?.data?.results ?? res?.data ?? [],
  });

  const rows = (data ?? []).slice(0, 10);

  const fmt = (v?: string) => {
    if (!v) return "-";
    const d = new Date(v);
    return isNaN(d.getTime())
      ? "-"
      : d.toLocaleString("id-ID", { hour12: false });
  };

  return (
    <Paper withBorder radius="md" p="sm">
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Waktu</Table.Th>
            <Table.Th>IP</Table.Th>
            <Table.Th>Perangkat</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((e, idx) => (
            <Table.Tr key={e.id ?? e._id ?? idx}>
              <Table.Td>{fmt(e.createdAt ?? e.time ?? e.loggedAt)}</Table.Td>
              <Table.Td>{e.ip ?? e.ipAddress ?? "-"}</Table.Td>
              <Table.Td>{e.userAgent ?? e.device ?? "-"}</Table.Td>
              <Table.Td>
                <Badge>
                  {e.success ?? e.ok ?? e.status === "success"
                    ? "Sukses"
                    : "Gagal"}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
          {rows.length === 0 && !isLoading && (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text c="dimmed" ta="center">
                  Belum ada riwayat login.
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {isLoading && (
        <Text c="dimmed" size="sm">
          Memuat riwayat login…
        </Text>
      )}
      {error && !isLoading && (
        <Text c="red" size="sm">
          Gagal memuat riwayat login.
        </Text>
      )}
    </Paper>
  );
}
