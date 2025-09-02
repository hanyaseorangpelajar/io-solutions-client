"use client";

import { Stack, Title, SimpleGrid } from "@mantine/core";
import StatsCards from "./StatsCards";
import QuickActions from "./QuickActions";
import AuditTable from "./AuditTable";
import SystemParamsPanel from "./SystemParamsPanel";

export function SysAdminPage() {
  return (
    <Stack>
      <Title order={3}>SysAdmin</Title>

      <StatsCards />

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <AuditTable />
        <Stack gap="md">
          <QuickActions />
          <SystemParamsPanel />
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}
