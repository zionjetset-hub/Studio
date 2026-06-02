import { GlowCard } from "@/components/ui/GlowCard";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  children?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  children,
}: MetricCardProps) {
  return (
    <GlowCard className="flex flex-col">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {value}
          </p>
          {change ? (
            <p className="mt-1 text-xs text-emerald-400">{change}</p>
          ) : null}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <Icon className="h-5 w-5 text-white/70" />
        </div>
      </div>
      {children ? <div className="mt-auto flex-1">{children}</div> : null}
    </GlowCard>
  );
}
