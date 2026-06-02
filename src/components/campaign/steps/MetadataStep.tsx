import { GENRES } from "@/lib/constants";
import type { CampaignFormData } from "@/types/database";

interface MetadataStepProps {
  form: CampaignFormData;
  onChange: (partial: Partial<CampaignFormData>) => void;
}

export function MetadataStep({ form, onChange }: MetadataStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Track Metadata</h2>
        <p className="mt-1 text-sm text-white/50">
          Define your release identity for algorithmic distribution.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/40">
            Track Title
          </label>
          <input
            type="text"
            className="input-luxury"
            placeholder="Enter track title"
            value={form.trackTitle}
            onChange={(e) => onChange({ trackTitle: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/40">
            Genre
          </label>
          <select
            className="input-luxury cursor-pointer appearance-none"
            value={form.genre}
            onChange={(e) => onChange({ genre: e.target.value })}
          >
            <option value="" disabled className="bg-black">
              Select genre
            </option>
            {GENRES.map((g) => (
              <option key={g} value={g} className="bg-black">
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/40">
            Artist Name
          </label>
          <input
            type="text"
            className="input-luxury"
            placeholder="Your artist name"
            value={form.artistName}
            onChange={(e) => onChange({ artistName: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/40">
            ISRC Code
          </label>
          <input
            type="text"
            className="input-luxury font-mono"
            placeholder="US-XXX-XX-XXXXX (optional)"
            value={form.isrc}
            onChange={(e) => onChange({ isrc: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
