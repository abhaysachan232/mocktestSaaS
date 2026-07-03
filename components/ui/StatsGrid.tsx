import { LucideIcon } from "lucide-react";
import { StatsCard } from "./StatsCard";

export interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5

        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {stats.map((item) => (
        <StatsCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          iconBg={item.iconBg}
          iconColor={item.iconColor}
        />
      ))}
    </div>
  );
}
