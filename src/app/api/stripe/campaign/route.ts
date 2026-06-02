import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, getAppUrl } from "@/lib/stripe";
import { CAMPAIGN_TIERS } from "@/lib/constants";
import type { CampaignTier } from "@/types/database";

interface CampaignCheckoutBody {
  trackTitle: string;
  genre: string;
  artistName: string;
  isrc?: string | null;
  tier: CampaignTier;
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
    const { trackTitle, genre, artistName, isrc, tier } = body;

    if (!trackTitle || !genre || !artistName || !tier) {
      return NextResponse.json(
        { error: "Missing required campaign fields" },
        { status: 400 }
      );
    }

    const tierConfig = CAMPAIGN_TIERS[tier];
    if (!tierConfig) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const amountCents = tierConfig.price * 100;

    const { data: campaign, error: insertError } = await supabase
      .from("campaigns")
      .insert({
        user_id: user.id,
        track_title: trackTitle,
        genre,
        artist_name: artistName,
        isrc: isrc ?? null,
        tier,
        tier_amount_cents: amountCents,
        status: "pending_payment",
      })
      .select("id")
      .single();

    if (insertError || !campaign) {
      console.error("Campaign insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save campaign" },
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
      success_url: `${appUrl}/dashboard/campaigns?success=campaign&id=${campaign.id}`,
      cancel_url: `${appUrl}/dashboard/launch?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        campaign_id: campaign.id,
        tier,
      },
    });

    await supabase
      .from("campaigns")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", campaign.id);

    return NextResponse.json({ url: session.url, campaignId: campaign.id });
  } catch (error) {
    console.error("Campaign checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
