"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShellLayout, defaultNav } from "@/features/shell";
import { LoadingOverlay } from "@mantine/core";
import { useAuth } from "@/features/auth/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/sign-in?redirectedFrom=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  if (user) {
    return (
      <AppShellLayout navItems={defaultNav} headerTitle="I/O SOLUTIONS">
        {children}
      </AppShellLayout>
    );
  }

  return null;
}
