"use client";

import Image from "next/image";
import {
  ActionIcon,
  Box,
  Burger,
  Group,
  Text,
  Tooltip,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import logo from "../../../../public/logo.jpeg";

type HeaderBarProps = {
  opened: boolean;
  setOpened: (v: boolean) => void;
  title?: string;
  tagline?: string;
  href?: string;
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

function BrandBar({
  title = "I/O SOLUTIONS",
  tagline = "Dari | Untuk | Oleh : Golden Service",
}: {
  title?: string;
  tagline?: string;
}) {
  const theme = useMantineTheme();
  return (
    <Group gap={12} wrap="nowrap">
      <Image
        src={logo}
        alt="Golden Service Logo"
        style={{
          height: rem(36),
          width: "auto",
          display: "block",
          borderRadius: rem(6),
        }}
        priority
      />

      <Box style={{ lineHeight: 1.1, overflow: "hidden" }}>
        <Text
          fw={600}
          fz="sm"
          tt="uppercase"
          style={{
            letterSpacing: rem(2.4),
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          title={title}
          aria-label={title}
        >
          {title}
        </Text>
        <Text
          c="dimmed"
          fz={10}
          tt="uppercase"
          style={{
            letterSpacing: rem(2),
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          title={tagline}
        >
          {tagline}
        </Text>
      </Box>
    </Group>
  );
}

export default function HeaderBar({
  opened,
  setOpened,
  title,
  tagline,
  href,
}: HeaderBarProps) {
  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      <Group gap="sm" wrap="nowrap">
        <Burger
          opened={opened}
          onClick={() => setOpened(!opened)}
          hiddenFrom="sm"
        />
        <BrandBar title={title} tagline={tagline} />
      </Group>

      <Group gap="sm" wrap="nowrap">
        <ThemeToggle />
      </Group>
    </Group>
  );
}
