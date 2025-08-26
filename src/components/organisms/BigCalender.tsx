// src/components/data-display/charts/BigCalendar.tsx
"use client";

import * as React from "react";
import moment from "moment";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Global overrides untuk .rbc-* sudah ada di globals.css (toolbar, buttons, warna event, dll).
const localizer = momentLocalizer(moment);

export type CalEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
};

type Props = {
  events?: CalEvent[];
  initialView?: View; // default: WORK_WEEK
  views?: View[]; // default: [WORK_WEEK, DAY]
  minHour?: number; // 0–23, default: 8
  maxHour?: number; // 0–23, default: 17
  className?: string; // wrapper classes
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
  // Lazy fallback: coba ambil demo data dari @/lib/data jika ada
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
      className={[
        "border border-[var(--mono-border)] bg-[var(--mono-bg)] text-[var(--mono-fg)] p-3",
        "transition duration-200",
        className,
      ].join(" ")}
      aria-label="Schedule Calendar"
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
        className="h-[480px]"
      />
    </section>
  );
}
