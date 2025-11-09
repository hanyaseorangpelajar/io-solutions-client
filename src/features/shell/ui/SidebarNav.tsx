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
  acc: string[] = []
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
  pathname: string
): string | null {
  const hrefs = collectHrefs(items, []);
  const candidates = hrefs.filter(
    (h) => pathname === h || pathname.startsWith(h + "/")
  );
  candidates.sort((a, b) => b.length - a.length);
  return candidates[0] ?? null;
}

export default function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  const list = Array.isArray(items) ? items : [];
  const { logout } = useAuth();
  const modals = useModals();

  const pathname = usePathname();
  const activeHref = useMemo(
    () => findActiveHref(list, pathname),
    [list, pathname]
  );

  const groupKeys = useMemo(
    () => list.filter((i) => i.group && i.children?.length).map((g) => g.label),
    [list]
  );
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(groupKeys.map((k) => [k, false]))
  );
  const toggle = (k: string) => setOpen((p) => ({ ...p, [k]: !p[k] }));

  const openLogoutModal = () => {
    modals.openConfirmModal({
      title: "Konfirmasi Logout",
      centered: true,
      children: (
        <Text size="sm">Apakah Anda yakin ingin keluar dari sesi ini?</Text>
      ),
      labels: { confirm: "Logout", cancel: "Batal" },
      confirmProps: { color: "red" },
      onConfirm: logout,
    });
  };

  const renderLink = (item: NavItem) => {
    const active = !!item.href && item.href === activeHref;
    const hasChildren =
      Array.isArray(item.children) && item.children.length > 0;

    let icon: React.ReactNode = undefined;
    if (item.href === "/views/settings/account") {
      icon = <IconUser size={16} />;
    }

    if (item.id === "logout") {
      return (
        <NavLink
          key={item.label}
          label={item.label}
          color="red"
          onClick={openLogoutModal}
          leftSection={<IconLogout size={16} />}
          childrenOffset={12}
          variant="light"
        />
      );
    }

    return (
      <NavLink
        key={item.href ?? item.label}
        active={active}
        label={item.label}
        component={item.href ? (Link as any) : undefined}
        href={item.href as any}
        onClick={onNavigate}
        leftSection={icon}
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
    <Stack gap={4} h="100%">
      <ScrollArea style={{ flex: 1 }} type="auto">
        <Stack gap={4} p="xs">
          {list.map((it) => (it.group ? renderGroup(it) : renderLink(it)))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
