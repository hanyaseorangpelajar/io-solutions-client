import { AppShellLayout, defaultNav } from "@/features/shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellLayout
      navItems={defaultNav}
      headerTitle="I/O SOLUTIONS"
      headerTagline="DATA • INFORMATION • KNOWLEDGE • WISDOM"
      headerHref="/(dashboard)/sysadmin"
    >
      {children}
    </AppShellLayout>
  );
}
