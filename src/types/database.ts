export type SubscriptionStatus =
  | "inactive"
  | "active"
  | "past_due"
  | "canceled"
  | "trialing";

export type CampaignTier =
  | "emerging_push"
  | "chart_accelerator"
  | "global_domination";

export type CampaignStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "processing"
  | "active"
  | "completed"
  | "canceled";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  artist_name: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  subscription_current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  track_title: string;
  genre: string;
  artist_name: string;
  isrc: string | null;
  tier: CampaignTier;
  tier_amount_cents: number;
  status: CampaignStatus;
  audio_file_path: string | null;
  video_file_path: string | null;
  stripe_checkout_session_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignFormData {
  trackTitle: string;
  genre: string;
  artistName: string;
  isrc: string;
  audioFile: File | null;
  videoFile: File | null;
  tier: CampaignTier | null;
}
