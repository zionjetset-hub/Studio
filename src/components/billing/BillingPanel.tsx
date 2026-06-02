"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlowCard } from "@/components/ui/GlowCard";
import { SUBSCRIPTION_PRICE_MONTHLY } from "@/lib/constants";
import { Check, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { SubscriptionStatus } from "@/types/database";

interface BillingPanelProps {
  status: SubscriptionStatus;
  periodEnd: string | null;
}

export function BillingPanel({ status, periodEnd }: BillingPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const subscribeRequired = searchParams.get("subscribe") === "required";
  const success = searchParams.get("success") === "subscription";

  const isActive = status === "active" || status === "trialing";

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/subscription", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start checkout");
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {subscribeRequired && !isActive && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-200">
              Subscription required
            </p>
            <p className="mt-1 text-sm text-amber-200/70">
              Activate your $25/month membership to access the full platform.
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4">
          <Check className="h-5 w-5 text-emerald-400" />
          <p className="text-sm text-emerald-200">
            Subscription activated. Welcome to the platform.
          </p>
        </div>
      )}

      <GlowCard className="glow-border-active">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">
            Platform Membership
          </p>
          <p className="mt-4 text-5xl font-bold text-white">
            ${SUBSCRIPTION_PRICE_MONTHLY}
            <span className="text-lg font-normal text-white/40">/mo</span>
          </p>
          <p className="mt-4 text-sm text-white/50 max-w-md mx-auto">
            Full access to Command Center, campaign launcher, analytics suite,
            and priority algorithm tooling.
          </p>
        </div>

        <ul className="mt-8 space-y-3 border-t border-white/5 pt-8">
          {[
            "Unlimited dashboard access",
            "Campaign launcher & history",
            "Real-time analytics",
            "Algorithm performance insights",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-white/70">
              <Check className="h-4 w-4 shrink-0 text-white" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          {isActive ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4">
              <p className="text-sm font-medium text-emerald-400">
                Active subscription
              </p>
              {periodEnd && (
                <p className="mt-1 text-xs text-white/40">
                  Renews {new Date(periodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <>
              {error && (
                <p className="mb-4 text-sm text-red-400">{error}</p>
              )}
              <Button
                size="lg"
                className="w-full max-w-sm"
                onClick={handleSubscribe}
                loading={loading}
              >
                Subscribe Now
              </Button>
            </>
          )}
        </div>
      </GlowCard>

      <p className="text-center text-xs text-white/25">
        Payments secured by Stripe. Cancel anytime from your customer portal.
      </p>
    </div>
  );
}
