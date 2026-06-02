import { CAMPAIGN_TIERS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";
import type { CampaignFormData } from "@/types/database";

interface CheckoutStepProps {
  form: CampaignFormData;
  onActivate: () => void;
  loading: boolean;
  error: string | null;
}

export function CheckoutStep({
  form,
  onActivate,
  loading,
  error,
}: CheckoutStepProps) {
  const tier = form.tier ? CAMPAIGN_TIERS[form.tier] : null;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">Campaign Summary</h2>
        <p className="mt-1 text-sm text-white/50">
          Review your release before activating the algorithm.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/50 p-6 space-y-4">
        <div className="flex justify-between border-b border-white/5 pb-4">
          <span className="text-sm text-white/50">Track</span>
          <span className="text-sm font-medium text-white">
            {form.trackTitle}
          </span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-4">
          <span className="text-sm text-white/50">Artist</span>
          <span className="text-sm font-medium text-white">
            {form.artistName}
          </span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-4">
          <span className="text-sm text-white/50">Genre</span>
          <span className="text-sm font-medium text-white">{form.genre}</span>
        </div>
        {form.isrc && (
          <div className="flex justify-between border-b border-white/5 pb-4">
            <span className="text-sm text-white/50">ISRC</span>
            <span className="font-mono text-sm text-white">{form.isrc}</span>
          </div>
        )}
        <div className="flex justify-between border-b border-white/5 pb-4">
          <span className="text-sm text-white/50">Audio</span>
          <span className="text-sm text-white">
            {form.audioFile?.name ?? "—"}
          </span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-4">
          <span className="text-sm text-white/50">Video</span>
          <span className="text-sm text-white">
            {form.videoFile?.name ?? "Not provided"}
          </span>
        </div>
        <div className="flex justify-between pt-2">
          <span className="text-sm font-medium text-white">Campaign Tier</span>
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{tier?.name}</p>
            <p className="text-lg font-bold text-white">
              {tier ? formatCurrency(tier.price) : "—"}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col items-center gap-4">
        <Button
          size="lg"
          className="w-full max-w-md gap-2 !shadow-[0_0_48px_rgba(255,255,255,0.25)]"
          onClick={onActivate}
          loading={loading}
          disabled={!form.tier}
        >
          <Sparkles className="h-5 w-5" />
          Activate Algorithm
        </Button>
        <p className="text-center text-xs text-white/30">
          Secure checkout powered by Stripe. One-time campaign fee.
        </p>
      </div>
    </div>
  );
}
