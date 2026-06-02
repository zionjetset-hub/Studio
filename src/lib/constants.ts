import type { CampaignTier } from "@/types/database";

export const SUBSCRIPTION_PRICE_MONTHLY = 25;

export const CAMPAIGN_TIERS: Record<
  CampaignTier,
  { name: string; price: number; description: string; features: string[] }
> = {
  emerging_push: {
    name: "Emerging Push",
    price: 500,
    description: "Targeted playlist pitching and micro-influencer seeding.",
    features: [
      "50+ curated playlist pitches",
      "TikTok creator outreach (25)",
      "7-day algorithm boost window",
    ],
  },
  chart_accelerator: {
    name: "Chart Accelerator",
    price: 1250,
    description: "Aggressive multi-platform velocity for chart momentum.",
    features: [
      "150+ premium playlist placements",
      "TikTok trend campaign (100 creators)",
      "Spotify editorial consideration",
      "14-day sustained push",
    ],
  },
  global_domination: {
    name: "Global Domination",
    price: 2500,
    description: "Full-spectrum global rollout with priority algorithm access.",
    features: [
      "300+ global playlist network",
      "Cross-platform viral seeding",
      "Radio & DSP editorial outreach",
      "30-day dedicated campaign manager",
    ],
  },
};

export const GENRES = [
  "Pop",
  "Hip-Hop / Rap",
  "R&B / Soul",
  "Electronic / EDM",
  "Rock / Alternative",
  "Country",
  "Latin",
  "Afrobeats",
  "Indie",
  "Other",
] as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/launch", label: "Launch Campaign", icon: "Rocket" },
  {
    href: "/dashboard/campaigns",
    label: "Campaign History",
    icon: "History",
  },
  { href: "/dashboard/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/dashboard/billing", label: "Billing", icon: "CreditCard" },
] as const;
