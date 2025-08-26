"use client";

import * as React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import MonoCard from "@/components/molecules/MonoCard";
import MonoBadge from "@/components/atoms/MonoBadge";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type LogEvent = {
  id: string | number;
  title: string;
  time: string;
  description: string;
};

type Props = {
  title?: string;
  events?: LogEvent[];
  defaultDate?: Date;
  className?: string;
};

const DEFAULT_EVENTS: LogEvent[] = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    time: "12:00 PM – 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "12:00 PM – 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    time: "12:00 PM – 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

function formatDateLabel(value: Value) {
  const fmt = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  if (value instanceof Date) return fmt(value);
  if (Array.isArray(value)) {
    const [start, end] = value;
    if (start && end) return `${fmt(start)} – ${fmt(end)}`;
    if (start) return fmt(start);
    if (end) return fmt(end);
  }
  return "";
}

export default function Log({
  title = "Log",
  events = DEFAULT_EVENTS,
  defaultDate = new Date(),
  className = "",
}: Props) {
  const [value, setValue] = React.useState<Value>(defaultDate);
  const dateLabel = React.useMemo(() => formatDateLabel(value), [value]);

  return (
    <MonoCard
      className={className}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            {title}
          </h2>
          <MonoBadge ghost={false} className="px-2 py-0.5 text-xs">
            {dateLabel}
          </MonoBadge>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Calendar (tampilan dikendalikan lewat globals.css → .react-calendar …) */}
        <section className="border p-3 transition duration-200">
          <Calendar onChange={setValue as any} value={value} />
        </section>

        {/* Events */}
        <section className="flex flex-col gap-3">
          {events.length === 0 ? (
            <p className="text-sm text-[var(--mono-muted)]">Belum ada event.</p>
          ) : (
            events.map((ev) => (
              <article
                key={ev.id}
                className="p-3 border transition duration-200 hover:bg-mono-fg hover:text-mono-bg"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium">{ev.title}</h3>
                  <MonoBadge className="px-2 py-0.5 text-[10px]">
                    {ev.time}
                  </MonoBadge>
                </div>
                <p className="mt-1 text-sm text-[var(--mono-muted)]">
                  {ev.description}
                </p>
              </article>
            ))
          )}
        </section>
      </div>
    </MonoCard>
  );
}
