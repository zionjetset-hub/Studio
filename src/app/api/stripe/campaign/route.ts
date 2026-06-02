import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, getAppUrl } from "@/lib/stripe";
import { CAMPAIGN_TIERS } from "@/lib/constants";
import type { CampaignTier } from "@/types/database";

interface CampaignCheckoutBody {
  campaignId: string;
  audioFilePath?: string | null;
  videoFilePath?: string | null;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CampaignCheckoutBody;
    const { campaignId, audioFilePath, videoFilePath } = body;

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    if (!audioFilePath) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    const { data: campaign, error: fetchError } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const tier = campaign.tier as CampaignTier;
    const tierConfig = CAMPAIGN_TIERS[tier];
    if (!tierConfig) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const amountCents = campaign.tier_amount_cents;
    const trackTitle = campaign.track_title;
    const artistName = campaign.artist_name;

    const { error: updateError } = await supabase
      .from("campaigns")
      .update({
        audio_file_path: audioFilePath,
        video_file_path: videoFilePath ?? null,
        status: "pending_payment",
      })
      .eq("id", campaignId);

    if (updateError) {
      console.error("Campaign update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update campaign assets" },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    const appUrl = getAppUrl();

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? profile?.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${tierConfig.name} — ${trackTitle}`,
              description: `Music campaign for ${artistName}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard/campaigns?success=campaign&id=${campaignId}`,
      cancel_url: `${appUrl}/dashboard/launch?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        campaign_id: campaignId,
        tier,
      },
    });

    await supabase
      .from("campaigns")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", campaignId);

    return NextResponse.json({ url: session.url, campaignId });
  } catch (error) {
    console.error("Campaign checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
