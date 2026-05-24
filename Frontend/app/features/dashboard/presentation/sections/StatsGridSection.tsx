import type { ReactNode } from "react";
import type { StatTileData } from "../../model";
import { MetricTile } from "../components/MetricTile";
import { SectionHeader } from "../components/SectionHeader";

type StatsGridSectionProps = {
  stats: StatTileData[];
  variant?: "neutral" | "primary";
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  columnsClassName?: string;
};

export function StatsGridSection({
  stats,
  variant = "primary",
  title,
  subtitle,
  action,
  columnsClassName = "md:grid-cols-2",
}: StatsGridSectionProps) {
  return (
    <section>
      {(title || subtitle || action) && (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            {title && (
              <SectionHeader
                title={title}
                subtitle={subtitle}
                titleClassName="text-5xl font-semibold text-gray-900"
                subtitleClassName="mt-2 text-base text-gray-500"
              />
            )}
            {!title && subtitle && <p className="text-base text-gray-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}

      <div className={`grid gap-4 ${columnsClassName}`.trim()}>
        {stats.map((stat) => (
          <MetricTile
            key={stat.label}
            label={stat.label}
            value={stat.value}
            unit={stat.unit}
            variant={variant}
          />
        ))}
      </div>
    </section>
  );
}
