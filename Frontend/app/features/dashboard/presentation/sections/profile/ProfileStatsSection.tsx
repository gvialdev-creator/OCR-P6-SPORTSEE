import type { ReactNode } from "react";
import type { StatTileData } from "../../../model";
import { SectionHeader } from "../../components/SectionHeader";
import { BurnedCaloriesStat } from "./BurnedCaloriesStat";
import { RestDaysStat } from "./RestDaysStat";
import { SessionCountStat } from "./SessionCountStat";
import { TotalDistanceStat } from "./TotalDistanceStat";
import { TotalRunningTimeStat } from "./TotalRunningTimeStat";

type ProfileStatsSectionProps = {
  stats: StatTileData[];
  variant?: "neutral" | "primary";
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  columnsClassName?: string;
};

const getStatValue = (stats: StatTileData[], label: string): string => {
  return stats.find((stat) => stat.label === label)?.value ?? "0";
};

export function ProfileStatsSection({
  stats,
  variant = "primary",
  title,
  subtitle,
  action,
  columnsClassName = "md:grid-cols-2",
}: ProfileStatsSectionProps) {
  const totalRunningTime = getStatValue(stats, "Temps total couru");
  const totalDistance = getStatValue(stats, "Distance totale parcourue");
  const sessionCount = getStatValue(stats, "Nombre de sessions");
  const burnedCalories = getStatValue(stats, "Calories brulees");
  const restDays = getStatValue(stats, "Nombre de jours de repos");

  return (
    <section>
      {(title || subtitle || action) && (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            {title && (
              <SectionHeader
                title={title}
                subtitle={subtitle}
                titleClassName="text-5xl font-semibold text-primary"
                subtitleClassName="mt-2 text-base text-soft"
              />
            )}
            {!title && subtitle && <p className="text-base text-soft">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}

      <div className={`grid gap-4 ${columnsClassName}`.trim()}>
        <TotalRunningTimeStat value={totalRunningTime} variant={variant} />
        <BurnedCaloriesStat value={burnedCalories} variant={variant} />
        <TotalDistanceStat value={totalDistance} variant={variant} />
        <RestDaysStat value={restDays} variant={variant} />
        <SessionCountStat value={sessionCount} variant={variant} />
      </div>
    </section>
  );
}
