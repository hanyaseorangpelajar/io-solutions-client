"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { DatesProvider } from "@mantine/dates";
import theme from "./theme/mantine";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <NavigationProgress />
        <ModalsProvider>
          <DatesProvider settings={{ locale: "id" }}>
            <Notifications position="top-right" />
            {children}
          </DatesProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
