"use client";

import { useEffect, useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/AuthContext";
import {
  Tabs,
  Paper,
  Stack,
  Group,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Divider,
  LoadingOverlay,
  Text,
  Badge,
  Pagination,
  Box,
} from "@mantine/core";
import apiClient from "@/lib/apiClient";
import { notifications } from "@mantine/notifications";
import { SimpleTable, type Column } from "@/shared/ui/table/SimpleTable";
import { formatDateTime } from "@/features/tickets/utils/format";

type ProfileFormData = {
  nama: string;
  username: string;
};

type LoginAttempt = {
  id: string;
  ip?: string;
  userAgent?: string;
  success: boolean;
  createdAt: string;
};

type Paginated<T> = {
  results: T[];
  page: number;
  limit: number;
  totalResults: number;
  totalPages: number;
};

const formatTanggal = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return formatDateTime(dateString);
  } catch (e) {
    return "-";
  }
};

export default function AccountPage() {
  const queryClient = useQueryClient();
  const { user, refetchUser, isLoading } = useAuth();

  const [profile, setProfile] = useState<ProfileFormData>({
    nama: "",
    username: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [historyPage, setHistoryPage] = useState(1);
  const HISTORY_PAGE_LIMIT = 5;

  useEffect(() => {
    if (user) {
      setProfile({
        nama: user.nama || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiClient.patch("/users/me", data);
      return response.data;
    },
    onSuccess: () => {
      notifications.show({
        title: "Berhasil",
        message: "Informasi akun berhasil diperbarui.",
        color: "green",
      });
      if (refetchUser) refetchUser();
    },
    onError: (error: any) => {
      notifications.show({
        title: "Gagal",
        message:
          error?.response?.data?.message || "Gagal memperbarui informasi.",
        color: "red",
      });
    },
  });

  const { mutate: changePassword, isPending: isChangingPassword } = useMutation(
    {
      mutationFn: async () => {
        if (newPassword !== confirmPassword) {
          throw new Error("Konfirmasi password baru tidak cocok.");
        }
        if (!currentPassword || !newPassword) {
          throw new Error("Semua field password wajib diisi.");
        }

        await apiClient.patch("/users/me/password", {
          currentPassword,
          newPassword,
        });
      },
      onSuccess: () => {
        notifications.show({
          title: "Berhasil",
          message: "Password berhasil diubah.",
          color: "green",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      },
      onError: (error: any) => {
        notifications.show({
          title: "Gagal",
          message:
            error?.response?.data?.message ||
            error.message ||
            "Gagal mengubah password.",
          color: "red",
        });
      },
    }
  );

  const { data: historyData, isLoading: isLoadingHistory } = useQuery<
    Paginated<LoginAttempt>
  >({
    queryKey: [
      "users",
      "me",
      "login-history",
      { page: historyPage, limit: HISTORY_PAGE_LIMIT },
    ],
    queryFn: async () => {
      const res = await apiClient.get("/users/me/login-history", {
        params: {
          page: historyPage,
          limit: HISTORY_PAGE_LIMIT,
        },
      });
      return res.data;
    },
    enabled: !!user,
  });

  const historyColumns: Column<LoginAttempt>[] = [
    {
      key: "status",
      header: "Status",
      align: "center",
      width: 100,
      cell: (r) => (
        <Badge color={r.success ? "green" : "red"} variant="light" radius="sm">
          {r.success ? "Berhasil" : "Gagal"}
        </Badge>
      ),
    },
    {
      key: "time",
      header: "Waktu",
      width: 180,
      cell: (r) => formatTanggal(r.createdAt),
    },
    {
      key: "ip",
      header: "Alamat IP",
      width: 140,
      cell: (r) => r.ip ?? "-",
    },
    {
      key: "userAgent",
      header: "Perangkat",
      cell: (r) => r.userAgent ?? "-",
    },
  ];

  const handleProfileSave = () => {
    updateProfile(profile);
  };

  const handlePasswordSave = () => {
    changePassword();
  };

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (!user) {
    return null;
  }

  const historyRows = historyData?.results ?? [];
  const historyTotalPages = historyData?.totalPages ?? 1;

  return (
    <Stack gap="md">
      <Title order={3}>Pengaturan Akun</Title>
      <Paper withBorder p="lg" radius="md">
        <Tabs defaultValue="profile">
          <Tabs.List>
            <Tabs.Tab value="profile">Informasi Akun</Tabs.Tab>
            <Tabs.Tab value="security">Keamanan</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="md">
            <Stack gap="md" pos="relative">
              <LoadingOverlay visible={isUpdatingProfile} />
              <Title order={5}>Profil Anda</Title>

              <TextInput
                label="Nama Lengkap"
                withAsterisk
                value={profile.nama}
                onChange={(e) => {
                  const newValue = e.currentTarget.value;
                  setProfile((p: ProfileFormData) => ({
                    ...p,
                    nama: newValue,
                  }));
                }}
              />
              <TextInput
                label="Username"
                withAsterisk
                value={profile.username}
                description="Username tidak dapat diubah."
                readOnly
                disabled
              />
              <TextInput
                label="Role"
                value={user.role}
                readOnly
                disabled
                description="Role tidak dapat diubah."
              />
              <TextInput
                label="Terakhir Diperbarui"
                value={formatTanggal(user.diperbaruiPada)}
                readOnly
                disabled
              />

              <Group justify="end" mt="md">
                <Button onClick={handleProfileSave} loading={isUpdatingProfile}>
                  Simpan Perubahan
                </Button>
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="security" pt="md">
            <Stack gap="md" pos="relative">
              <LoadingOverlay visible={isChangingPassword} />
              <Title order={5}>Ubah Password</Title>

              <PasswordInput
                label="Password saat ini"
                value={currentPassword}
                onChange={(e) => {
                  const newValue = e.currentTarget.value;
                  setCurrentPassword(newValue);
                }}
                withAsterisk
              />
              <PasswordInput
                label="Password baru"
                value={newPassword}
                onChange={(e) => {
                  const newValue = e.currentTarget.value;
                  setNewPassword(newValue);
                }}
                withAsterisk
              />
              <PasswordInput
                label="Konfirmasi password baru"
                value={confirmPassword}
                onChange={(e) => {
                  const newValue = e.currentTarget.value;
                  setConfirmPassword(newValue);
                }}
                withAsterisk
              />

              <Group justify="end" mt="md">
                <Button
                  onClick={handlePasswordSave}
                  loading={isChangingPassword}
                >
                  Simpan Password
                </Button>
              </Group>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Divider my="xl" />

        <Stack gap="md">
          <Title order={5}>Riwayat Login</Title>
          <Box pos="relative">
            <LoadingOverlay visible={isLoadingHistory} />
            <SimpleTable
              columns={historyColumns}
              data={historyRows}
              emptyText="Tidak ada riwayat login"
              maxHeight={300}
            />
          </Box>
          <Group justify="end">
            <Pagination
              total={historyTotalPages}
              value={historyPage}
              onChange={setHistoryPage}
              disabled={historyTotalPages <= 1}
            />
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
