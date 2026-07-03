import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}: StatsCardProps) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-100
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        hover:border-blue-100
      "
    >
      {/* Gradient Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-linear-to-r
          from-blue-50/0
          to-blue-50/50
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2
            className="
              mt-3
              text-3xl
              font-bold
              text-slate-900
              md:text-4xl
            "
          >
            {value}
          </h2>
        </div>

        <div
          className={`
            ${iconBg}
            rounded-2xl
            p-4
            transition-transform
            duration-300
            group-hover:scale-110
          `}
        >
          <Icon className={`h-6 w-6 md:h-7 md:w-7 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
