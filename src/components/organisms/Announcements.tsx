"use client";
import * as React from "react";
import MonoCard from "@/components/molecules/MonoCard";
import MonoBadge from "@/components/atoms/MonoBadge";

type AnnouncementItemProps = {
  title: string;
  date: string;
  desc: string;
};

function AnnouncementItem({ title, date, desc }: AnnouncementItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="group border px-3 py-2 transition duration-200 cursor-pointer hover:bg-mono-fg hover:text-mono-bg outline-none focus-visible:ring-1 focus-visible:ring-[var(--mono-fg)]"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-medium">{title}</h2>
        <MonoBadge ghost={false} className="px-2 py-0.5 text-xs">
          {date}
        </MonoBadge>
      </div>
      <p className="text-sm mt-1 text-[var(--mono-muted)] group-hover:text-mono-bg">
        {desc}
      </p>
    </div>
  );
}

export default function Announcements() {
  return (
    <MonoCard
      header={
        <h1 className="text-sm font-semibold uppercase tracking-wider">
          Pengumuman
        </h1>
      }
    >
      <div className="flex flex-col gap-3 mt-1">
        <AnnouncementItem
          title="Lorem ipsum dolor sit"
          date="2025-01-01"
          desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita."
        />
        <AnnouncementItem
          title="Lorem ipsum dolor sit"
          date="2025-01-01"
          desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita."
        />
        <AnnouncementItem
          title="Lorem ipsum dolor sit"
          date="2025-01-01"
          desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita."
        />
      </div>
    </MonoCard>
  );
}
