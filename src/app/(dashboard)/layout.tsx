import { AppShellLayout, defaultNav } from "@/features/shell";

export const metadata = {
  title: "Dashboard — I/O SOLUTIONS",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShellLayout navItems={defaultNav} headerTitle="Dashboard">
      {children}
    </AppShellLayout>
  );
}
