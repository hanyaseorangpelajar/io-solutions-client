// src/app/layout.tsx
import Providers from "@/providers";
import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "I/O SOLUTIONS",
  description: "System Information",
};

const DEFAULT_SCHEME = "dark" as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-mantine-color-scheme={DEFAULT_SCHEME}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <ColorSchemeScript defaultColorScheme={DEFAULT_SCHEME} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
