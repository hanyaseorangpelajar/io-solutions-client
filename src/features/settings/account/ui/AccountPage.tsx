// src/features/settings/account/ui/AccountPage.tsx

"use client";

import { useEffect, useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/AuthContext"; // Pastikan path ini benar
import LoginHistoryTable from "./LoginHistoryTable";
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
} from "@mantine/core";
import apiClient from "@/lib/apiClient";
import { notifications } from "@mantine/notifications";

// Tipe untuk data form profil
type ProfileFormData = {
  fullName: string;
  email: string;
};

// Helper untuk format tanggal
const formatTanggal = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

export default function AccountPage() {
  const queryClient = useQueryClient();

  // --- PERBAIKAN DI SINI ---
  // 'refetch' diganti namanya menjadi 'refetchUser' agar sesuai dengan context
  const { user, refetchUser } = useAuth(); // Ambil data user dari context
  // --- AKHIR PERBAIKAN ---

  // State untuk form profil
  const [profile, setProfile] = useState<ProfileFormData>({
    fullName: "",
    email: "",
  });

  // State untuk form ganti password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Isi form dengan data user ketika data user sudah tersedia
  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        email: user.email || "", // Sekarang 'email' ada di tipe User
      });
    }
  }, [user]);

  // Mutasi untuk update profil (Nama & Email)
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
      // Ambil ulang data user di context agar ter-update
      if (refetchUser) refetchUser(); // Panggil 'refetchUser'
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

  // Mutasi untuk ganti password
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
        // Kosongkan field password
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

  const handleProfileSave = () => {
    updateProfile(profile);
  };

  const handlePasswordSave = () => {
    changePassword();
  };

  if (!user) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack gap="md">
      <Title order={3}>Pengaturan Akun</Title>
      <Paper withBorder p="lg" radius="md">
        <Tabs defaultValue="profile">
          <Tabs.List>
            <Tabs.Tab value="profile">Informasi Akun</Tabs.Tab>
            <Tabs.Tab value="security">Keamanan & Riwayat</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="md">
            <Stack gap="md" pos="relative">
              <LoadingOverlay visible={isUpdatingProfile} />
              <Title order={5}>Profil Anda</Title>
              <Group grow>
                <TextInput
                  label="Nama Lengkap"
                  withAsterisk
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      fullName: e.currentTarget.value,
                    }))
                  }
                />
                <TextInput
                  label="Alamat Email"
                  withAsterisk
                  value={profile.email} // Sekarang 'email' valid
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, email: e.currentTarget.value }))
                  }
                />
              </Group>

              <Group grow>
                <TextInput
                  label="Role"
                  value={user.role}
                  readOnly
                  disabled
                  description="Role tidak dapat diubah."
                />
                <TextInput
                  label="Terakhir Diperbarui"
                  value={formatTanggal(user.updatedAt)} // Sekarang 'updatedAt' valid
                  readOnly
                  disabled
                />
              </Group>

              <Group justify="end">
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
              <Group grow>
                <PasswordInput
                  label="Password saat ini"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.currentTarget.value)}
                  withAsterisk
                />
                <PasswordInput
                  label="Password baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.currentTarget.value)}
                  withAsterisk
                />
                <PasswordInput
                  label="Konfirmasi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                  withAsterisk
                />
              </Group>
              <Group justify="end" mb="sm">
                <Button
                  onClick={handlePasswordSave}
                  loading={isChangingPassword}
                >
                  Simpan Password
                </Button>
              </Group>
              <Divider />
              <Title order={5}>Riwayat Login</Title>
              <LoginHistoryTable />
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Stack>
  );
}
