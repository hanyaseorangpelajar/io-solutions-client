"use client";

import { useState } from "react";
import { AppShell } from "@mantine/core";
import SidebarNav from "./SidebarNav";
import HeaderBar from "./HeaderBar";
import type { NavItem } from "../model/nav";

export default function AppShellLayout({
  children,
  navItems,
  headerTitle,
  headerTagline,
  headerHref,
}: {
  children: React.ReactNode;
  navItems: NavItem[];
  headerTitle?: string;
  headerTagline?: string;
  headerHref?: string;
}) {
  const [opened, setOpened] = useState(false); // navbar mobile

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
        <SidebarNav items={navItems} onNavigate={() => setOpened(false)} />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
