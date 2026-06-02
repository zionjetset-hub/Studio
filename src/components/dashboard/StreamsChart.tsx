"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const data = [
  { day: "Mon", streams: 12400 },
  { day: "Tue", streams: 18200 },
  { day: "Wed", streams: 15800 },
  { day: "Thu", streams: 24100 },
  { day: "Fri", streams: 31200 },
  { day: "Sat", streams: 38900 },
  { day: "Sun", streams: 42100 },
];

export function StreamsChart() {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="streamGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#525252", fontSize: 10 }}
        />
        <Tooltip
          contentStyle={{
            background: "#121212",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#fff",
            fontSize: 12,
          }}
          formatter={(value) => [
            typeof value === "number" ? value.toLocaleString() : String(value),
            "Streams",
          ]}
        />
        <Area
          type="monotone"
          dataKey="streams"
          stroke="#ffffff"
          strokeWidth={2}
          fill="url(#streamGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
