// src/components/data-display/Announcements.tsx
"use client";

import * as React from "react";

export type Announcement = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  content: string;
  href?: string; // optional, kalau mau clickable ke detail
};

type Props = {
  items?: Announcement[];
  /** Balik warna kartu saat hover (default: true) */
  invertOnHover?: boolean;
  className?: string;
};

const demoItems: Announcement[] = [
  {
    id: "a-1",
    title: "Lorem ipsum dolor sit",
    date: "2025-01-01",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita. Rerum, quidem facilis?",
  },
  {
    id: "a-2",
    title: "Lorem ipsum dolor sit",
    date: "2025-01-01",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita. Rerum, quidem facilis?",
  },
  {
    id: "a-3",
    title: "Lorem ipsum dolor sit",
    date: "2025-01-01",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita. Rerum, quidem facilis?",
  },
];

export default function Announcements({
  items = demoItems,
  invertOnHover = true,
  className = "",
}: Props) {
  const panel =
    "bg-[var(--mono-bg)] text-[var(--mono-fg)] p-4 rounded-none border border-[var(--mono-border)]";
  const list = "flex flex-col gap-4 mt-4";

  const cardBase =
    "group relative border border-[var(--mono-border)] rounded-none p-4 " +
    "bg-[var(--mono-bg)] text-[var(--mono-fg)] transition-colors";
  const cardHover = invertOnHover
    ? "hover:bg-[var(--mono-fg)] hover:text-[var(--mono-bg)]"
    : "";

  const chipBase =
    "text-xs px-1 py-1 rounded-none border border-[var(--mono-border)] " +
    "transition-colors";
  const chipColors = invertOnHover
    ? // default chip: dark bg, light text → balik saat hover kartu
      "bg-[var(--mono-fg)] text-[var(--mono-bg)] group-hover:bg-[var(--mono-bg)] group-hover:text-[var(--mono-fg)]"
    : // non-invert: tetap putih-hitam
      "bg-[var(--mono-bg)] text-[var(--mono-fg)]";

  return (
    <section className={`${panel} ${className}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pengumuman</h1>
      </div>

      <div className={list}>
        {items.map((it) => (
          <article
            key={it.id}
            className={`${cardBase} ${cardHover}`}
            aria-label={it.title}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{it.title}</h2>
              <time
                dateTime={it.date}
                className={`${chipBase} ${chipColors}`}
                aria-label="Tanggal"
              >
                {it.date}
              </time>
            </div>
            <p className="text-sm mt-1">{it.content}</p>

            {it.href ? (
              <a
                href={it.href}
                className="absolute inset-0"
                aria-label={`Buka ${it.title}`}
              />
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
