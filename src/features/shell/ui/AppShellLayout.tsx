"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@mantine/core";
import SidebarNav from "./SidebarNav";
import HeaderBar from "./HeaderBar";
import { MASTER_NAV, filterNavItemsByRole, type UserRole } from "../model/nav";
import { useAuth } from "@/features/auth";

export default function AppShellLayout({
  children,
  headerTitle,
  headerTagline,
  headerHref,
}: {
  children: React.ReactNode;
  headerTitle?: string;
  headerTagline?: string;
  headerHref?: string;
}) {
  const [opened, setOpened] = useState(false);

  const { user } = useAuth();
  const userRole = user?.role as UserRole | undefined;

  const accessibleNavItems = useMemo(() => {
    if (!userRole) {
      return [];
    }
    return filterNavItemsByRole(MASTER_NAV, userRole);
  }, [userRole]);

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
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
