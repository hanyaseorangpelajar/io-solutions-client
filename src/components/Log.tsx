"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
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

const Log = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white text-black p-4 rounded-none border border-black">
      <Calendar onChange={onChange} value={value} />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Log</h1>
      </div>

      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div key={event.id} className="p-5 rounded-none border border-black">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{event.title}</h2>
              <span className="text-xs text-white bg-black px-2 py-1 rounded-none">
                {event.time}
              </span>
            </div>
            <p className="mt-2 text-sm">{event.description}</p>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: 1px solid #000;
          background: #fff;
          color: #000;
          border-radius: 0;
        }
        .react-calendar *,
        .react-calendar *:before,
        .react-calendar *:after {
          color: inherit !important;
        }
        .react-calendar__navigation {
          border-bottom: 1px solid #000;
        }
        .react-calendar__navigation button {
          background: #fff;
          border-radius: 0;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background: #000;
          color: #fff !important;
        }
        .react-calendar__month-view__weekdays {
          background: #fff;
          border-bottom: 1px solid #000;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        .react-calendar__tile {
          background: #fff;
          border-radius: 0;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: #000;
          color: #fff !important;
        }
        .react-calendar__tile--now {
          background: #fff !important;
          outline: 2px solid #000;
          color: #000 !important;
        }
        .react-calendar__tile--active,
        .react-calendar__tile--rangeStart,
        .react-calendar__tile--rangeEnd,
        .react-calendar__tile--hasActive {
          background: #000 !important;
          color: #fff !important;
        }
        .react-calendar__tile--range {
          background: #000 !important;
          color: #fff !important;
        }
        .react-calendar__tile--range:enabled:hover,
        .react-calendar__tile--range:enabled:focus {
          background: #000 !important;
          color: #fff !important;
        }
        .react-calendar__year-view__months__month,
        .react-calendar__decade-view__years__year,
        .react-calendar__century-view__decades__decade {
          border-radius: 0;
        }
      `}</style>
    </div>
  );
};

export default Log;
