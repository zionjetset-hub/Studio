import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { CAMPAIGN_TIERS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Campaign } from "@/types/database";
import { Rocket, Clock } from "lucide-react";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  pending_payment: "Pending Payment",
  paid: "Paid",
  processing: "Processing",
  active: "Active",
  completed: "Completed",
  canceled: "Canceled",
};

export default async function CampaignsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const list = (campaigns ?? []) as Campaign[];

  return (
    <div>
      <DashboardHeader
        title="Campaign History"
        subtitle="Track every release campaign and its current status."
      />

      {list.length === 0 ? (
        <GlowCard className="flex flex-col items-center justify-center py-16 text-center">
          <Rocket className="mb-4 h-10 w-10 text-white/20" />
          <p className="text-white/60">No campaigns yet</p>
          <p className="mt-2 text-sm text-white/30 max-w-sm">
            Launch your first campaign to start building algorithm momentum.
          </p>
          <a
            href="/dashboard/launch"
            className="mt-6 inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:shadow-[0_0_32px_rgba(255,255,255,0.3)]"
          >
            Launch Campaign
          </a>
        </GlowCard>
      ) : (
        <div className="space-y-4">
          {list.map((campaign) => {
            const tier = CAMPAIGN_TIERS[campaign.tier];
            return (
              <GlowCard key={campaign.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-white truncate">
                    {campaign.track_title}
                  </p>
                  <p className="text-sm text-white/50">
                    {campaign.artist_name} · {campaign.genre}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                    {campaign.isrc && (
                      <span className="font-mono">ISRC: {campaign.isrc}</span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                    {statusLabels[campaign.status] ?? campaign.status}
                  </span>
                  <p className="text-sm text-white/50">{tier?.name}</p>
                  <p className="text-lg font-bold text-white">
                    {formatCurrency(tier?.price ?? campaign.tier_amount_cents / 100)}
                  </p>
                </div>
              </GlowCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
