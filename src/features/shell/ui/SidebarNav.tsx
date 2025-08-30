"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  NavLink,
  ScrollArea,
  Stack,
  ActionIcon,
  Group,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import type { NavItem } from "../model/nav";

type SidebarNavProps = {
  items?: NavItem[]; // boleh undefined: defensif
  onNavigate?: () => void;
};

// Kumpulkan semua href dari pohon nav (aman bila nodes bukan array)
function collectHrefs(
  nodes: NavItem[] | undefined | null,
  acc: string[] = []
): string[] {
  if (!Array.isArray(nodes)) return acc;
  for (const n of nodes) {
    if (n.href) acc.push(n.href);
    if (n.children?.length) collectHrefs(n.children, acc);
  }
  return acc;
}

// Temukan href terpanjang yang cocok dengan pathname saat ini
function findActiveHref(
  items: NavItem[] | undefined | null,
  pathname: string
): string | null {
  const hrefs = collectHrefs(items, []);
  const candidates = hrefs.filter(
    (h) => pathname === h || pathname.startsWith(h + "/")
  );
  candidates.sort((a, b) => b.length - a.length); // longest first
  return candidates[0] ?? null;
}

export default function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  const list = Array.isArray(items) ? items : [];
  const pathname = usePathname();
  const activeHref = useMemo(
    () => findActiveHref(list, pathname),
    [list, pathname]
  );

  // inisialisasi state open per-group (default: open)
  const groupKeys = useMemo(
    () => list.filter((i) => i.group && i.children?.length).map((g) => g.label),
    [list]
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
          {/* Header group saja, TIDAK ada teks "Navigasi" global */}
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--mantine-color-dimmed)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {group.label}
          </span>
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
    <Stack gap={4} h="100%">
      <ScrollArea style={{ flex: 1 }} type="auto">
        <Stack gap={4} p="xs">
          {list.map((it) => (it.group ? renderGroup(it) : renderLink(it)))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
