"use client";

import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const platformData = [
  { platform: "Spotify", streams: 1240000 },
  { platform: "Apple", streams: 520000 },
  { platform: "TikTok", streams: 890000 },
  { platform: "YouTube", streams: 197000 },
];

const weeklyGrowth = [
  { week: "W1", listeners: 4200 },
  { week: "W2", listeners: 6800 },
  { week: "W3", listeners: 11200 },
  { week: "W4", listeners: 18400 },
  { week: "W5", listeners: 24100 },
  { week: "W6", listeners: 31200 },
];

const tooltipStyle = {
  background: "#121212",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#fff",
  fontSize: 12,
};

export default function AnalyticsPage() {
  return (
    <div>
      <DashboardHeader
        title="Analytics"
        subtitle="Deep performance insights across every distribution channel."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <GlowCard>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white/60">
            Streams by Platform
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={platformData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                type="number"
                tick={{ fill: "#525252", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="platform"
                tick={{ fill: "#a3a3a3", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="streams" fill="#ffffff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlowCard>

        <GlowCard>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white/60">
            Monthly Listener Growth
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="week"
                tick={{ fill: "#525252", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#525252", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="listeners"
                stroke="#ffffff"
                strokeWidth={2}
                dot={{ fill: "#fff", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlowCard>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Avg. Listen Duration", value: "2:14" },
          { label: "Playlist Reach", value: "2.4M" },
          { label: "Fan Conversion", value: "12.8%" },
          { label: "Viral Coefficient", value: "1.47" },
        ].map((stat) => (
          <GlowCard key={stat.label} className="text-center">
            <p className="text-xs uppercase tracking-widest text-white/40">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}
