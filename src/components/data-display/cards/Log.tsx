// src/components/data-display/cards/Log.tsx
"use client";

import * as React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

export default function Log({
  title = "Log",
  events = DEFAULT_EVENTS,
  defaultDate = new Date(),
  className = "",
}: Props) {
  const [value, onChange] = React.useState<Value>(defaultDate);

  return (
    <section
      className={[
        "bg-[var(--mono-bg)] text-[var(--mono-fg)]",
        "border border-[var(--mono-border)] rounded-none p-4",
        className,
      ].join(" ")}
    >
      {/* Calendar (styling lanjut di globals.css → .react-calendar ...) */}
      <Calendar onChange={onChange} value={value} />

      {/* Header */}
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {/* Events */}
      <div className="flex flex-col gap-3 mt-3">
        {events.map((ev) => (
          <article
            key={ev.id}
            className="p-4 border border-[var(--mono-border)] rounded-none bg-[var(--mono-bg)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{ev.title}</h3>
              <span
                className={[
                  "text-xs px-2 py-1 rounded-none border border-[var(--mono-border)]",
                  // pill invert to keep contrast high and konsisten mono
                  "bg-[var(--mono-fg)] text-[var(--mono-bg)]",
                ].join(" ")}
              >
                {ev.time}
              </span>
            </div>
            <p className="mt-2 text-sm opacity-90">{ev.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
