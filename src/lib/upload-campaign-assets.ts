import { createClient } from "@/lib/supabase/client";

const BUCKET = "campaign-assets";

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadCampaignAsset(
  userId: string,
  campaignId: string,
  file: File,
  kind: "audio" | "video"
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? (kind === "audio" ? "wav" : "mp4");
  const path = `${userId}/${campaignId}/${kind}.${sanitizeFilename(ext)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || undefined,
  });

  if (error) {
    throw new Error(`Failed to upload ${kind}: ${error.message}`);
  }

  return path;
}
