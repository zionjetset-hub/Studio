"use client";

const bars = [35, 52, 48, 71, 65, 88, 94, 82, 96, 100];

export function TrendVelocity() {
  return (
    <div className="flex h-[120px] items-end justify-between gap-1.5">
      {bars.map((height, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-white/20 transition-all duration-500 hover:bg-white/40"
          style={{
            height: `${height}%`,
            boxShadow:
              height > 85 ? "0 0 12px rgba(255,255,255,0.3)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
