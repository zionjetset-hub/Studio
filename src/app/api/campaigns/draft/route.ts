import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CampaignTier } from "@/types/database";

interface DraftBody {
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

    const body = (await request.json()) as DraftBody;
    const { trackTitle, genre, artistName, isrc, tier } = body;

    if (!trackTitle || !genre || !artistName || !tier) {
      return NextResponse.json(
        { error: "Missing required campaign fields" },
        { status: 400 }
      );
    }

    const { CAMPAIGN_TIERS } = await import("@/lib/constants");
    const tierConfig = CAMPAIGN_TIERS[tier];
    if (!tierConfig) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert({
        user_id: user.id,
        track_title: trackTitle,
        genre,
        artist_name: artistName,
        isrc: isrc ?? null,
        tier,
        tier_amount_cents: tierConfig.price * 100,
        status: "draft",
      })
      .select("id")
      .single();

    if (error || !campaign) {
      console.error("Draft campaign error:", error);
      return NextResponse.json(
        { error: "Failed to create campaign draft" },
        { status: 500 }
      );
    }

    return NextResponse.json({ campaignId: campaign.id });
  } catch (error) {
    console.error("Draft campaign error:", error);
    return NextResponse.json(
      { error: "Failed to create campaign draft" },
      { status: 500 }
    );
  }
}
