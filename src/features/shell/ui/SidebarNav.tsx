"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  ActionIcon,
  Group,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import type { NavItem } from "../model/nav";

type SidebarNavProps = {
  items: NavItem[];
  onNavigate?: () => void;
};

// Kumpulkan semua href dari pohon nav
function collectHrefs(nodes: NavItem[], acc: string[] = []): string[] {
  for (const n of nodes) {
    if (n.href) acc.push(n.href);
    if (n.children?.length) collectHrefs(n.children, acc);
  }
  return acc;
}

// Temukan href terpanjang yang cocok dengan pathname saat ini
function findActiveHref(items: NavItem[], pathname: string): string | null {
  const hrefs = collectHrefs(items);
  const candidates = hrefs.filter(
    (h) => pathname === h || pathname.startsWith(h + "/")
  );
  candidates.sort((a, b) => b.length - a.length); // longest first
  return candidates[0] ?? null;
}

export default function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const activeHref = useMemo(
    () => findActiveHref(items, pathname),
    [items, pathname]
  );

  // inisialisasi state open per-group (default: open)
  const groupKeys = useMemo(
    () =>
      items.filter((i) => i.group && i.children?.length).map((g) => g.label),
    [items]
  );
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(groupKeys.map((k) => [k, true]))
  );
  const toggle = (k: string) => setOpen((p) => ({ ...p, [k]: !p[k] }));

  const renderLink = (item: NavItem) => {
    const active = !!item.href && item.href === activeHref;
    const hasChildren =
      Array.isArray(item.children) && item.children.length > 0;

    return (
      <NavLink
        key={item.href ?? item.label}
        active={active}
        leftSection={item.icon}
        label={item.label}
        component={item.href ? (Link as any) : undefined}
        href={item.href as any}
        onClick={onNavigate}
        childrenOffset={12}
        variant="light"
      >
        {hasChildren ? item.children!.map((child) => renderLink(child)) : null}
      </NavLink>
    );
  };

  const renderGroup = (group: NavItem) => {
    const k = group.label;
    const opened = open[k] ?? true;

    return (
      <Box key={`group-${k}`}>
        <Group px="md" py={6} justify="space-between">
          <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts={0.5}>
            {group.label}
          </Text>
          <ActionIcon
            size="sm"
            variant="subtle"
            aria-label={opened ? "Collapse" : "Expand"}
            onClick={() => toggle(k)}
          >
            <IconChevronDown
              size={14}
              style={{
                transform: `rotate(${opened ? 0 : -90}deg)`,
                transition: "transform 120ms",
              }}
            />
          </ActionIcon>
        </Group>

        {opened && (
          <Stack gap={2} pl="xs">
            {group.children?.map((child) => renderLink(child))}
          </Stack>
        )}
      </Box>
    );
  };

  return (
    <Stack gap="xs" h="100%">
      <ScrollArea style={{ flex: 1 }} type="auto">
        <Stack gap={4} p="xs">
          {items.map((it) => (it.group ? renderGroup(it) : renderLink(it)))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
