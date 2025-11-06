"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoginHistoryTable from "./LoginHistoryTable";
import {
  Tabs,
  Paper,
  Stack,
  Group,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Switch,
  Button,
  Divider,
  FileInput,
  Table,
  Badge,
} from "@mantine/core";
import apiClient from "@/lib/apiClient";
import { notifications } from "@mantine/notifications";
import type { AccountProfile, SecuritySettings } from "../model/types";

export default function AccountPage() {
  const [profile, setProfile] = useState<AccountProfile>({
    name: "Sysadmin",
    email: "sysadmin@example.com",
    phone: "0812-0000-0000",
    department: "IT Operations",
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    recoveryEmail: "sysadmin.recovery@example.com",
  });
  const done = () => {
    console.log("Saved settings");
  };
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      notifications.show({
        title: "Gagal",
        message: "Konfirmasi password baru tidak cocok.",
        color: "red",
      });
      return;
    }
    if (!currentPassword || !newPassword) {
      notifications.show({
        title: "Gagal",
        message: "Semua field password wajib diisi.",
        color: "red",
      });
      return;
    }

    try {
      await apiClient.patch("/users/me/password", {
        currentPassword,
        newPassword,
      });

      notifications.show({
        title: "Sukses",
        message: "Password berhasil diperbarui.",
        color: "green",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Password lama salah atau terjadi error";
      notifications.show({
        title: "Gagal",
        message: message,
        color: "red",
      });
    }
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <div>
          <Title order={3} style={{ lineHeight: 1.2 }}>
            Pengaturan Akun
          </Title>
          <Text c="dimmed">Kelola profil dan keamanan.</Text>
        </div>
      </Group>
      <Paper withBorder radius="md" p="md">
        <Tabs defaultValue="info" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="info">Informasi Akun</Tabs.Tab>
            <Tabs.Tab value="security">Keamanan</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="info" pt="md">
            <Stack gap="md">
              <Group grow>
                <TextInput
                  label="Nama"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.currentTarget.value })
                  }
                  withAsterisk
                />
                <TextInput
                  label="Email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.currentTarget.value })
                  }
                  withAsterisk
                />
              </Group>

              <Group grow>
                <TextInput
                  label="Telepon"
                  value={profile.phone ?? ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.currentTarget.value })
                  }
                />
                <TextInput
                  label="Departemen"
                  value={profile.department ?? ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      department: e.currentTarget.value,
                    })
                  }
                />
              </Group>

              <Group grow>
                <FileInput
                  label="Foto profil"
                  placeholder="Pilih file..."
                  accept="image/*"
                />
              </Group>

              <Group justify="end">
                <Button variant="default">Batalkan</Button>
                <Button onClick={done}>Simpan</Button>
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="security" pt="md">
            <Stack gap="md">
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
                <Button onClick={handleChangePassword}>Simpan password</Button>
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
