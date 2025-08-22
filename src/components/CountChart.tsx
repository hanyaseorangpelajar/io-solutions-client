"use client";
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from "recharts";

const COLOR_TOTAL = "#FFFFFF";
const COLOR_TICKET = "#FEE715";
const COLOR_TEKNISI = "#101820";

const data = [
  { name: "Total", count: 106, fill: COLOR_TOTAL },
  { name: "Ticket", count: 53, fill: COLOR_TICKET },
  { name: "Teknisi", count: 53, fill: COLOR_TEKNISI },
];

const total = data[0].count;
const ticket = data[1].count;
const teknisi = data[2].count;
const ticketPct = Math.round((ticket / total) * 100);
const teknisiPct = Math.round((teknisi / total) * 100);

const CountChart = () => {
  return (
    <div className="bg-white text-black rounded-none border border-black w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Ratio</h1>
      </div>

      <div className="mt-2 mb-2">
        <div className="text-3xl font-bold leading-none">{total}</div>
        <div className="text-xs uppercase">Total</div>
      </div>

      <div className="relative w-full h-[50%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={28}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="count"
              isAnimationActive={false}
              cornerRadius={0}
              background
            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.fill}
                  stroke="#000000"
                  strokeWidth={1}
                />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex justify-center gap-16">
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-5 h-5 border border-black rounded-none"
            style={{ backgroundColor: COLOR_TEKNISI }}
          />
          <h2 className="font-bold">{teknisi.toLocaleString()}</h2>
          <p className="text-xs">Teknisi ({teknisiPct}%)</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-5 h-5 border border-black rounded-none"
            style={{ backgroundColor: COLOR_TICKET }}
          />
          <h2 className="font-bold">{ticket.toLocaleString()}</h2>
          <p className="text-xs">Ticket ({ticketPct}%)</p>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
