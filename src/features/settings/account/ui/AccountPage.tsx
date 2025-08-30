"use client";

import { useState } from "react";
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
  Select,
  Button,
  Divider,
  FileInput,
} from "@mantine/core";
import type {
  AccountProfile,
  SecuritySettings,
  NotificationSettings,
} from "../model/types";

export default function AccountPage() {
  // Mock state lokal (UI-only)
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

  const [notif, setNotif] = useState<NotificationSettings>({
    updates: true,
    announcements: true,
    alerts: true,
    frequency: "immediate",
  });

  // helper sukses sederhana
  const done = () => {
    // kamu bisa ganti dengan notifications.show / modals / toast dsb.
    console.log("Saved settings");
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <div>
          <Title order={3} style={{ lineHeight: 1.2 }}>
            Pengaturan Akun
          </Title>
          <Text c="dimmed">Kelola profil, keamanan, dan notifikasi.</Text>
        </div>
      </Group>

      <Paper withBorder radius="md" p="md">
        <Tabs defaultValue="info" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="info">Informasi Akun</Tabs.Tab>
            <Tabs.Tab value="security">Keamanan</Tabs.Tab>
            <Tabs.Tab value="notifications">Notifikasi</Tabs.Tab>
          </Tabs.List>

          {/* Informasi Akun */}
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

          {/* Keamanan */}
          <Tabs.Panel value="security" pt="md">
            <Stack gap="md">
              <Title order={5}>Ubah Password</Title>
              <Group grow>
                <PasswordInput label="Password saat ini" />
                <PasswordInput label="Password baru" />
                <PasswordInput label="Konfirmasi password baru" />
              </Group>
              <Group justify="end" mb="sm">
                <Button onClick={done}>Simpan password</Button>
              </Group>

              <Divider />

              <Title order={5}>Two-Factor Authentication</Title>
              <Switch
                label="Aktifkan 2FA"
                checked={security.twoFactorEnabled}
                onChange={(e) =>
                  setSecurity({
                    ...security,
                    twoFactorEnabled: e.currentTarget.checked,
                  })
                }
              />
              <TextInput
                label="Email pemulihan"
                value={security.recoveryEmail ?? ""}
                onChange={(e) =>
                  setSecurity({
                    ...security,
                    recoveryEmail: e.currentTarget.value,
                  })
                }
              />

              <Group justify="end">
                <Button variant="default">Batalkan</Button>
                <Button onClick={done}>Simpan</Button>
              </Group>
            </Stack>
          </Tabs.Panel>

          {/* Notifikasi */}
          <Tabs.Panel value="notifications" pt="md">
            <Stack gap="md">
              <Title order={5}>Preferensi Notifikasi</Title>
              <Stack gap="xs">
                <Switch
                  label="Kirim notifikasi pembaruan tiket/pekerjaan"
                  checked={notif.updates}
                  onChange={(e) =>
                    setNotif({ ...notif, updates: e.currentTarget.checked })
                  }
                />
                <Switch
                  label="Kirim pengumuman sistem via email"
                  checked={notif.announcements}
                  onChange={(e) =>
                    setNotif({
                      ...notif,
                      announcements: e.currentTarget.checked,
                    })
                  }
                />
                <Switch
                  label="Kirim alert penting (misalnya SLA, stok kritis)"
                  checked={notif.alerts}
                  onChange={(e) =>
                    setNotif({ ...notif, alerts: e.currentTarget.checked })
                  }
                />
              </Stack>

              <Select
                label="Frekuensi rangkuman"
                data={[
                  { value: "immediate", label: "Langsung (real-time)" },
                  { value: "daily", label: "Harian" },
                  { value: "weekly", label: "Mingguan" },
                ]}
                value={notif.frequency}
                onChange={(v) =>
                  setNotif({ ...notif, frequency: (v as any) ?? "immediate" })
                }
              />

              <Group justify="end">
                <Button variant="default">Batalkan</Button>
                <Button onClick={done}>Simpan</Button>
              </Group>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Stack>
  );
}
