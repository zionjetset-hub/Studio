import { CAMPAIGN_TIERS } from "@/lib/constants";
import { formatCurrency, cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { CampaignTier } from "@/types/database";

interface TierStepProps {
  selected: CampaignTier | null;
  onSelect: (tier: CampaignTier) => void;
}

export function TierStep({ selected, onSelect }: TierStepProps) {
  const tiers = Object.entries(CAMPAIGN_TIERS) as [
    CampaignTier,
    (typeof CAMPAIGN_TIERS)[CampaignTier],
  ][];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Select Your Tier</h2>
        <p className="mt-1 text-sm text-white/50">
          Choose the campaign intensity that matches your release goals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1">
        {tiers.map(([key, tier]) => {
          const isSelected = selected === key;
          const isPremium = key === "global_domination";
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={cn(
                "group relative rounded-xl border p-6 text-left transition-all duration-300",
                isSelected
                  ? "border-white bg-white/5 glow-border-active"
                  : "border-white/10 bg-[#0a0a0a] hover:border-white/25",
                isPremium && !isSelected && "border-white/15"
              )}
            >
              {isPremium && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">
                  Flagship
                </span>
              )}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {formatCurrency(tier.price)}
                  </p>
                  <p className="mt-2 text-sm text-white/50">
                    {tier.description}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all",
                    isSelected
                      ? "border-white bg-white text-black"
                      : "border-white/20"
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-white/60"
                  >
                    <span className="h-1 w-1 rounded-full bg-white/40" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
