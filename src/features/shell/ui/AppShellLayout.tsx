"use client";

import { useState, useMemo, useEffect } from "react";
import { AppShell, Center, Loader } from "@mantine/core";
import SidebarNav from "./SidebarNav";
import HeaderBar from "./HeaderBar";
import { type NavItem } from "../model/nav";
import { useAuth } from "@/features/auth";

export default function AppShellLayout({
  children,
  headerTitle,
  headerTagline,
  headerHref,
  navItems = [],
}: {
  children: React.ReactNode;
  headerTitle?: string;
  headerTagline?: string;
  headerHref?: string;
  navItems?: NavItem[];
}) {
  const [opened, setOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh" w="100vw">
        <Loader size="md" />
      </Center>
    );
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const accessibleNavItems = useMemo(() => {
    if (!navItems || !navItems.length) return [];

    // Fallback: Bypass filter jika role sedang kosong saat transisi refresh
    if (!user?.role) return navItems;

    const userRoleUpper = user.role.toUpperCase();

    const filterItems = (items: NavItem[]): NavItem[] => {
      return items
        .filter((item) => {
          if (!item.roles || item.roles.length === 0) return true;
          return item.roles.some((r) => r.toUpperCase() === userRoleUpper);
        })
        .map((item) => ({
          ...item,
          children: item.children ? filterItems(item.children) : undefined,
        }))
        .filter(
          (item) => !item.group || (item.children && item.children.length > 0),
        );
    };

    return filterItems(navItems);
  }, [user?.role, navItems]);

  if (!isMounted || isLoading) {
    return (
      <Center h="100vh" w="100vw">
        <Loader size="md" />
      </Center>
    );
  }

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { desktop: false, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <HeaderBar
          opened={opened}
          setOpened={setOpened}
          title={headerTitle}
          tagline={headerTagline}
          href={headerHref}
        />
      </AppShell.Header>

      <AppShell.Navbar p="xs">
        <SidebarNav
          items={accessibleNavItems}
          onNavigate={() => setOpened(false)}
        />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
