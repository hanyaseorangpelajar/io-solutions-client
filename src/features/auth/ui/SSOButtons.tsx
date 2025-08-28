"use client";

import { Button, Stack } from "@mantine/core";

export default function SSOButtons() {
  return (
    <Stack gap="xs">
      <Button variant="default" fullWidth>
        Lanjut dengan Google
      </Button>
      <Button variant="default" fullWidth>
        Lanjut dengan GitHub
      </Button>
    </Stack>
  );
}
