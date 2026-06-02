"use client";

import { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { MetadataStep } from "./steps/MetadataStep";
import { AssetsStep } from "./steps/AssetsStep";
import { TierStep } from "./steps/TierStep";
import { CheckoutStep } from "./steps/CheckoutStep";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadCampaignAsset } from "@/lib/upload-campaign-assets";
import type { CampaignFormData, CampaignTier } from "@/types/database";

const STEPS = [
  { id: 1, label: "Metadata" },
  { id: 2, label: "Assets" },
  { id: 3, label: "Tier" },
  { id: 4, label: "Checkout" },
];

const initialForm: CampaignFormData = {
  trackTitle: "",
  genre: "",
  artistName: "",
  isrc: "",
  audioFile: null,
  videoFile: null,
  tier: null,
};

export function CampaignLauncher() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CampaignFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateForm(partial: Partial<CampaignFormData>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return Boolean(
          form.trackTitle.trim() &&
            form.genre &&
            form.artistName.trim()
        );
      case 2:
        return Boolean(form.audioFile);
      case 3:
        return Boolean(form.tier);
      case 4:
        return true;
      default:
        return false;
    }
  }

  async function handleActivate() {
    if (!form.tier || !form.audioFile) return;

    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be signed in");

      const draftRes = await fetch("/api/campaigns/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackTitle: form.trackTitle,
          genre: form.genre,
          artistName: form.artistName,
          isrc: form.isrc || null,
          tier: form.tier,
        }),
      });
      const draftData = await draftRes.json();
      if (!draftRes.ok) {
        throw new Error(draftData.error ?? "Failed to create campaign");
      }

      const campaignId = draftData.campaignId as string;

      const audioPath = await uploadCampaignAsset(
        user.id,
        campaignId,
        form.audioFile,
        "audio"
      );

      let videoPath: string | null = null;
      if (form.videoFile) {
        videoPath = await uploadCampaignAsset(
          user.id,
          campaignId,
          form.videoFile,
          "video"
        );
      }

      const checkoutRes = await fetch("/api/stripe/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          audioFilePath: audioPath,
          videoFilePath: videoPath,
        }),
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) {
        throw new Error(checkoutData.error ?? "Checkout failed");
      }
      if (checkoutData.url) window.location.href = checkoutData.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10 flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center gap-2 min-w-0">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300",
                step > s.id
                  ? "border-white bg-white text-black"
                  : step === s.id
                    ? "border-white bg-white/10 text-white glow-border-active"
                    : "border-white/20 text-white/40"
              )}
            >
              {step > s.id ? <Check className="h-4 w-4" /> : s.id}
            </div>
            <span
              className={cn(
                "hidden truncate text-xs sm:block",
                step >= s.id ? "text-white" : "text-white/30"
              )}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-px flex-1 min-w-[12px]",
                  step > s.id ? "bg-white/40" : "bg-white/10"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <GlowCard className="glow-border-active">
        {step === 1 && (
          <MetadataStep form={form} onChange={updateForm} />
        )}
        {step === 2 && (
          <AssetsStep form={form} onChange={updateForm} />
        )}
        {step === 3 && (
          <TierStep
            selected={form.tier}
            onSelect={(tier: CampaignTier) => updateForm({ tier })}
          />
        )}
        {step === 4 && (
          <CheckoutStep
            form={form}
            onActivate={handleActivate}
            loading={loading}
            error={error}
          />
        )}

        {step < 4 && (
          <div className="mt-8 flex justify-between gap-4 border-t border-white/5 pt-6">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Continue
            </Button>
          </div>
        )}
      </GlowCard>
    </div>
  );
}
