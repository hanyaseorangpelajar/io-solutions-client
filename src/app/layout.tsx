import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "I/O SOLUTIONS",
  description: "System Information",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      {/* Terapkan scope .mono di level body supaya semua page ikut theme */}
      <body
        className={`${inter.className} mono bg-mono-bg text-mono-fg antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
