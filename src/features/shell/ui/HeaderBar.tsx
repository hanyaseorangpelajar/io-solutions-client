"use client";

import {
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Group,
  Indicator,
  Menu,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import {
  IconBell,
  IconLogout,
  IconMoon,
  IconSearch,
  IconSun,
  IconUser,
} from "@tabler/icons-react";

type HeaderBarProps = {
  opened: boolean;
  setOpened: (v: boolean) => void; // toggle navbar mobile
  title?: string;
};

function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const next = computed === "dark" ? "light" : "dark";

  return (
    <Tooltip label={`Switch to ${next} mode`} withArrow>
      <ActionIcon
        variant="subtle"
        onClick={() => setColorScheme(next)}
        aria-label="Toggle color scheme"
      >
        {computed === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  );
}

export default function HeaderBar({
  opened,
  setOpened,
  title,
}: HeaderBarProps) {
  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      <Group gap="sm">
        <Burger
          opened={opened}
          onClick={() => setOpened(!opened)}
          hiddenFrom="sm"
        />
        <Text fw={600}>{title ?? "I/O SOLUTIONS"}</Text>
      </Group>

      <Group gap="sm" wrap="nowrap">
        <Box visibleFrom="sm">
          <TextInput
            placeholder="Cari…"
            leftSection={<IconSearch size={16} />}
            miw={260}
          />
        </Box>

        <ThemeToggle />

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Indicator size={8} color="red" offset={4} processing>
              <ActionIcon variant="subtle" aria-label="Notifikasi">
                <IconBell size={18} />
              </ActionIcon>
            </Indicator>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Notifikasi</Menu.Label>
            <Menu.Item>Kamu tidak punya notifikasi baru</Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Menu shadow="md" width={220}>
          <Menu.Target>
            <Avatar radius="xl" size={30} variant="filled" />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconUser size={16} />}>Profil</Menu.Item>
            <Menu.Item leftSection={<IconLogout size={16} />} color="red">
              Keluar
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
