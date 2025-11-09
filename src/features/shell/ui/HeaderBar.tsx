"use client";

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
  tagline = "Oleh Golden Service Tembalang",
}: {
  title?: string;
  tagline?: string;
}) {
  const theme = useMantineTheme();
  return (
    <Group gap={12} wrap="nowrap">
      <Box
        aria-label="Brand Logo"
        style={{
          display: "grid",
          placeItems: "center",
          width: rem(28),
          height: rem(28),
          border: `1px solid ${theme.colors.gray[4]}`,
          borderRadius: rem(6),
          textDecoration: "none",
          cursor: "default",
        }}
      >
        <Text
          component="span"
          ff={theme.fontFamilyMonospace}
          fw={800}
          fz={10}
          lh={1}
          style={{ letterSpacing: rem(0.5) }}
        >
          I<span style={{ padding: "0 1px" }}>/</span>O
        </Text>
      </Box>

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
