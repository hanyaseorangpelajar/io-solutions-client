"use client";

import {
  Button,
  Center,
  Group,
  Stack,
  Text,
  Title,
  ThemeIcon,
} from "@mantine/core";
import { IconError404 } from "@tabler/icons-react";
import Link from "next/link";

type Props = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function NotFoundState({
  title = "Halaman tidak ditemukan",
  description = "URL yang kamu buka tidak tersedia atau sudah dipindahkan.",
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: Props) {
  return (
    <Center h="100%" p="lg">
      <Stack gap="sm" align="center" ta="center">
        <ThemeIcon size={64} radius="xl" variant="light">
          <IconError404 size={36} />
        </ThemeIcon>
        <Title order={2} style={{ lineHeight: 1.2 }}>
          {title}
        </Title>
        <Text c="dimmed" maw={520}>
          {description}
        </Text>
        {(primaryHref || secondaryHref) && (
          <Group mt="sm">
            {primaryHref && (
              <Button component={Link} href={primaryHref}>
                {primaryLabel ?? "Kembali"}
              </Button>
            )}
            {secondaryHref && (
              <Button component={Link} href={secondaryHref} variant="light">
                {secondaryLabel ?? "Buka halaman lain"}
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Center>
  );
}
