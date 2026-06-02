import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RadialScore } from "@/components/dashboard/RadialScore";
import { StreamsChart } from "@/components/dashboard/StreamsChart";
import { TrendVelocity } from "@/components/dashboard/TrendVelocity";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  ListMusic,
  TrendingUp,
  Headphones,
  Zap,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("artist_name, full_name")
    .eq("id", user?.id ?? "")
    .single();

  const displayName =
    profile?.artist_name || profile?.full_name || user?.email?.split("@")[0] || "Artist";

  return (
    <div>
      <DashboardHeader
        title="Command Center"
        subtitle={`Welcome back, ${displayName}. The New Era of Music is At Your Fingertips.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GlowCard className="flex flex-col items-center justify-center sm:col-span-1">
          <RadialScore score={87} label="Global Algorithm Score" />
        </GlowCard>

        <MetricCard
          title="Active Playlist Adds"
          value="142"
          change="+23 this week"
          icon={ListMusic}
        />

        <MetricCard
          title="TikTok Trend Velocity"
          value="9.4x"
          change="Peak momentum"
          icon={TrendingUp}
        >
          <TrendVelocity />
        </MetricCard>

        <MetricCard
          title="Total Streams"
          value={formatNumber(2847000)}
          change="+18.2% vs last period"
          icon={Headphones}
        >
          <StreamsChart />
        </MetricCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <GlowCard className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <Zap className="h-5 w-5 text-white/70" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Algorithm Pulse
            </h2>
          </div>
          <p className="text-white/80 text-sm leading-relaxed max-w-xl">
            Your catalog is performing in the top 12% of independent releases
            this quarter. Recommendation engines across Spotify, Apple Music,
            and TikTok are actively surfacing your latest tracks to high-intent
            listeners.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
            {[
              { label: "Save Rate", value: "34.2%" },
              { label: "Skip Rate", value: "8.1%" },
              { label: "Discovery", value: "61K" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xs text-white/40 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </GlowCard>

        <GlowCard>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-4">
            Quick Actions
          </h2>
          <ul className="space-y-3">
            {[
              { label: "Launch new campaign", href: "/dashboard/launch" },
              { label: "View campaign history", href: "/dashboard/campaigns" },
              { label: "Deep analytics", href: "/dashboard/analytics" },
            ].map((action) => (
              <li key={action.href}>
                <a
                  href={action.href}
                  className="block rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 transition-all duration-300 hover:border-white/25 hover:text-white hover:bg-white/5"
                >
                  {action.label} →
                </a>
              </li>
            ))}
          </ul>
        </GlowCard>
      </div>
    </div>
  );
}
