"use client";

import { useCallback, useState } from "react";
import { Upload, Music, Film, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CampaignFormData } from "@/types/database";

interface AssetsStepProps {
  form: CampaignFormData;
  onChange: (partial: Partial<CampaignFormData>) => void;
}

interface DropZoneProps {
  label: string;
  accept: string;
  hint: string;
  icon: React.ReactNode;
  file: File | null;
  onFile: (file: File | null) => void;
}

function DropZone({ label, accept, hint, icon, file, onFile }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
    [onFile]
  );

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-white/40">
        {label}
      </p>
      {file ? (
        <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/5 px-4 py-4">
          <div className="flex items-center gap-3 min-w-0">
            {icon}
            <div className="min-w-0">
              <p className="truncate text-sm text-white">{file.name}</p>
              <p className="text-xs text-white/40">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFile(null)}
            className="shrink-0 rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all duration-300",
            dragging
              ? "border-white/40 bg-white/5 glow-border-active"
              : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
          )}
        >
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Upload className="h-5 w-5 text-white/60" />
          </div>
          <p className="text-sm font-medium text-white">
            Drag & drop or click to upload
          </p>
          <p className="mt-1 text-xs text-white/40">{hint}</p>
        </label>
      )}
    </div>
  );
}

export function AssetsStep({ form, onChange }: AssetsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Campaign Assets</h2>
        <p className="mt-1 text-sm text-white/50">
          Upload master-quality files for distribution and promotion.
        </p>
      </div>

      <DropZone
        label="Audio Master (WAV)"
        accept=".wav,audio/wav,audio/x-wav"
        hint="Lossless WAV, max 500MB"
        icon={<Music className="h-5 w-5 text-white/70 shrink-0" />}
        file={form.audioFile}
        onFile={(f) => onChange({ audioFile: f })}
      />

      <DropZone
        label="Visual Asset (MP4)"
        accept=".mp4,video/mp4"
        hint="MP4 vertical or horizontal, max 1GB"
        icon={<Film className="h-5 w-5 text-white/70 shrink-0" />}
        file={form.videoFile}
        onFile={(f) => onChange({ videoFile: f })}
      />
    </div>
  );
}
