import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { CampaignLauncher } from "@/components/campaign/CampaignLauncher";

export const metadata = {
  title: "Launch Campaign | AURA MUSIC",
};

export default function LaunchPage() {
  return (
    <div>
      <DashboardHeader
        title="Launch Campaign"
        subtitle="Configure your release and activate premium algorithm distribution."
      />
      <CampaignLauncher />
    </div>
  );
}
