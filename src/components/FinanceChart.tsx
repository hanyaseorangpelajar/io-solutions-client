"use client";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Apr", income: 2780, expense: 3908 },
  { name: "May", income: 1890, expense: 4800 },
  { name: "Jun", income: 2390, expense: 3800 },
  { name: "Jul", income: 3490, expense: 4300 },
  { name: "Aug", income: 3490, expense: 4300 },
  { name: "Sep", income: 3490, expense: 4300 },
  { name: "Oct", income: 3490, expense: 4300 },
  { name: "Nov", income: 3490, expense: 4300 },
  { name: "Dec", income: 3490, expense: 4300 },
];

const LegendMono = () => (
  <div className="flex items-center gap-6 pt-2 pb-6">
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="inline-block w-6 h-[2px] bg-black" />
      Income
    </span>
    <span className="inline-flex items-center gap-2 text-sm">
      <span
        className="inline-block w-6 h-[2px] bg-black"
        style={{
          backgroundImage: "linear-gradient(90deg,#000 50%,transparent 0)",
          backgroundSize: "8px 2px",
        }}
      />
      Expense
    </span>
  </div>
);

const FinanceChart = () => {
  return (
    <div className="bg-white text-black rounded-none border border-black w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Uang I/O</h1>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 16, left: 8, bottom: 10 }}
        >
          <CartesianGrid stroke="#000000" strokeDasharray="1 6" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fill: "#000000" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={20}
            tick={{ fill: "#000000" }}
          />
          <Tooltip
            cursor={{ stroke: "#000000", strokeDasharray: "2 4" }}
            contentStyle={{
              borderRadius: 0,
              border: "1px solid #000",
              background: "#fff",
              color: "#000",
            }}
            labelStyle={{ color: "#000" }}
            itemStyle={{ color: "#000" }}
          />
          <Legend verticalAlign="top" align="center" content={<LegendMono />} />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#000000"
            strokeWidth={3}
            dot={{ r: 3, stroke: "#000000", fill: "#FFFFFF" }}
            activeDot={{ r: 5, stroke: "#000000", fill: "#FFFFFF" }}
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#000000"
            strokeWidth={3}
            strokeDasharray="6 6"
            dot={{ r: 3, stroke: "#000000", fill: "#FFFFFF" }}
            activeDot={{ r: 5, stroke: "#000000", fill: "#FFFFFF" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
