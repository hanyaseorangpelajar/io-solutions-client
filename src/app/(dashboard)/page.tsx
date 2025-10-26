"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading) {
      if (user) router.replace(`/${user.role.toLowerCase()}`);
      else router.replace("/sign-in");
    }
  }, [user, isLoading, router]);
}
