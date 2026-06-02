import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BillingPanel } from "@/components/billing/BillingPanel";
import type { SubscriptionStatus } from "@/types/database";

export const metadata = {
  title: "Billing | AURA MUSIC",
};

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_current_period_end")
    .eq("id", user?.id ?? "")
    .single();

  return (
    <div>
      <DashboardHeader
        title="Billing"
        subtitle="Manage your platform membership and payment settings."
      />
      <Suspense fallback={<div className="text-white/40">Loading...</div>}>
        <BillingPanel
          status={(profile?.subscription_status as SubscriptionStatus) ?? "inactive"}
          periodEnd={profile?.subscription_current_period_end ?? null}
        />
      </Suspense>
    </div>
  );
}
