"use client";

import { useEffect, useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
} from "@mantine/core";
import apiClient from "@/lib/apiClient";
import { notifications } from "@mantine/notifications";

type ProfileFormData = {
  nama: string;
  username: string;
};

const formatTanggal = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

export default function AccountPage() {
  const queryClient = useQueryClient();

  const { user, refetchUser } = useAuth();

  const [profile, setProfile] = useState<ProfileFormData>({
    nama: "",
    username: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
            <Tabs.Tab value="security">Keamanan</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="md">
            <Stack gap="md" pos="relative">
              <LoadingOverlay visible={isUpdatingProfile} />
              <Title order={5}>Profil Anda</Title>
              <Group grow>
                <TextInput
                  label="Nama Lengkap"
                  withAsterisk
                  value={profile.nama}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      nama: e.currentTarget.value,
                    }))
                  }
                />
                <TextInput
                  label="Username"
                  withAsterisk
                  value={profile.username}
                  description="Username tidak dapat diubah."
                  readOnly
                  disabled
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
                  value={formatTanggal(user.diperbaruiPada)}
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
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Stack>
  );
}
