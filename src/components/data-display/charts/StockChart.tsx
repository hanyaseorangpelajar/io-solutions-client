"use client";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", present: 60, absent: 40 },
  { name: "Tue", present: 70, absent: 60 },
  { name: "Wed", present: 90, absent: 75 },
  { name: "Thu", present: 90, absent: 75 },
  { name: "Fri", present: 65, absent: 55 },
];

const LegendMono = () => (
  <div className="flex items-center gap-6 pt-4 pb-6">
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="inline-block w-3 h-3 bg-black border border-black" />
      Present
    </span>
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="inline-block w-3 h-3 bg-white border border-black" />
      Absent
    </span>
  </div>
);

const StockChart = () => {
  return (
    <div className="bg-white text-black rounded-none border border-black p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Stock I/O</h1>
        <Image src="/moreDark.png" alt="More" width={20} height={20} />
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} barSize={20}>
          <CartesianGrid
            stroke="#000000"
            strokeDasharray="1 6"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#000000" }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#000000" }} />
          <Tooltip
            cursor={false}
            contentStyle={{
              borderRadius: 0,
              border: "1px solid #000",
              background: "#fff",
              color: "#000",
            }}
            labelStyle={{ color: "#000" }}
            itemStyle={{ color: "#000" }}
          />
          <Legend verticalAlign="top" align="left" content={<LegendMono />} />
          <Bar
            dataKey="present"
            fill="#000000"
            stroke="#000000"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="#FFFFFF"
            stroke="#000000"
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
