import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export function GlowCard({ children, className, active }: GlowCardProps) {
  return (
    <div
      className={cn(
        "glow-card p-6",
        active && "glow-border-active",
        className
      )}
    >
      {children}
    </div>
  );
}
