// src/components/data-display/charts/BigCalendar.tsx
"use client";

import * as React from "react";
import moment from "moment";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

// NOTE: global overrides untuk .rbc-* sudah ada di globals.css kita
// (toolbar, btn-group, warna event, dsb). Di sini fokus ke API & tokens.

const localizer = momentLocalizer(moment);

export type CalEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
};

type Props = {
  /** data event; default ambil dari /lib/data kalau ada */
  events?: CalEvent[];
  /** view awal (default: WORK_WEEK) */
  initialView?: View;
  /** daftar view yang diizinkan (default: [WORK_WEEK, DAY]) */
  views?: View[];
  /** jam kerja min (0–23), default: 8 */
  minHour?: number;
  /** jam kerja max (0–23), default: 17 */
  maxHour?: number;
  /** className tambahan untuk wrapper */
  className?: string;
};

function dayAt(hour: number) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d;
}

export default function BigCalendar({
  events,
  initialView = Views.WORK_WEEK,
  views = [Views.WORK_WEEK, Views.DAY],
  minHour = 8,
  maxHour = 17,
  className = "",
}: Props) {
  // lazy import demo events kalau tidak dipassing
  const data = React.useMemo<CalEvent[]>(() => {
    if (events) return events;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { calendarEvents } = require("@/lib/data");
      return calendarEvents || [];
    } catch {
      return [];
    }
  }, [events]);

  const [view, setView] = React.useState<View>(initialView);

  return (
    <section
      className={`border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] p-3 ${className}`}
      aria-label="Kalender Jadwal"
    >
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        view={view}
        views={views}
        onView={setView}
        min={dayAt(minHour)}
        max={dayAt(maxHour)}
        // biar tinggi konsisten tanpa inline style fragment di parent
        className="h-[480px]"
      />
    </section>
  );
}
