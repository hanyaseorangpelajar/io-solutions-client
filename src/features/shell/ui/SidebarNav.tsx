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
  rem,
  Text,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { IconChevronDown, IconUser, IconLogout } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import type { NavItem } from "../model/nav";
import { useAuth } from "@/features/auth/AuthContext";

type SidebarNavProps = {
  items?: NavItem[];
  onNavigate?: () => void;
};

function collectHrefs(
  nodes: NavItem[] | undefined | null,
  acc: string[] = [],
): string[] {
  if (!Array.isArray(nodes)) return acc;
  for (const n of nodes) {
    if (n.href) acc.push(n.href);
    if (n.children?.length) collectHrefs(n.children, acc);
  }
  return acc;
}

function findActiveHref(
  items: NavItem[] | undefined | null,
  pathname: string,
): string | null {
  const hrefs = collectHrefs(items, []);
  const candidates = hrefs.filter(
    (h) => pathname === h || pathname.startsWith(`${h}/`),
  );
  candidates.sort((a, b) => b.length - a.length);
  return candidates.length > 0 ? candidates[0] : null;
}

export default function SidebarNav({
  items = [],
  onNavigate,
}: SidebarNavProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const modals = useModals();

  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (k: string) => setOpen((prev) => ({ ...prev, [k]: !prev[k] }));

  const activeHref = useMemo(
    () => findActiveHref(items, pathname),
    [items, pathname],
  );

  const confirmLogout = () => {
    modals.openConfirmModal({
      title: "Konfirmasi Logout",
      centered: true,
      children: (
        <Text size="sm">Apakah Anda yakin ingin keluar dari sistem?</Text>
      ),
      labels: { confirm: "Logout", cancel: "Batal" },
      confirmProps: { color: "red" },
      onConfirm: () => logout(),
    });
  };

  const renderLink = (child: NavItem) => {
    if (child.roles && user?.role && !child.roles.includes(user.role)) {
      return null;
    }

    const isActive = activeHref === child.href;

    return (
      <NavLink
        key={child.label}
        component={Link}
        href={child.href || "#"}
        label={child.label}
        active={isActive}
        onClick={onNavigate}
        variant="light"
        style={{ borderRadius: rem(6) }}
      >
        {child.children?.length
          ? child.children.map((sub) => renderLink(sub))
          : null}
      </NavLink>
    );
  };

  const renderGroup = (group: NavItem) => {
    if (group.roles && user?.role && !group.roles.includes(user.role)) {
      return null;
    }

    const k = group.label;
    const opened = open[k] ?? true;

    return (
      <Box key={`group-${k}`}>
        <Group px="md" py={rem(6)} justify="space-between">
          <span
            style={{
              fontSize: rem(12),
              fontWeight: 600,
              color: "var(--mantine-color-dimmed)",
              textTransform: "uppercase",
              letterSpacing: rem(0.5),
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
    <Stack h="100%" justify="space-between" pb="md">
      <ScrollArea style={{ flex: 1 }} type="hover">
        <Stack gap="xs" px="sm" pt="md">
          {items.map((item) =>
            item.group ? renderGroup(item) : renderLink(item),
          )}
        </Stack>
      </ScrollArea>

      <Stack px="sm" gap={4}>
        <NavLink
          component={Link}
          href="/views/settings/account"
          label={user?.name || "Profil"}
          description={user?.role || "Akses Pengaturan"}
          leftSection={<IconUser size={20} stroke={1.5} />}
          onClick={onNavigate}
          style={{ borderRadius: rem(6) }}
        />
        <NavLink
          label="Logout"
          leftSection={<IconLogout size={20} stroke={1.5} />}
          onClick={confirmLogout}
          color="red"
          variant="light"
          active
          style={{ borderRadius: rem(6) }}
        />
      </Stack>
    </Stack>
  );
}
