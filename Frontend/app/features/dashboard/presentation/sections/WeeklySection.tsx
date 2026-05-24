import { DashboardCard } from "../components/DashboardCard";
import { SectionHeader } from "../components/SectionHeader";
import { WeeklyProgressCard } from "./WeeklyProgressCard";

type WeeklySectionProps = {
  dateRangeLabel: string;
  sessionsDone: number;
  sessionsGoal: number;
  totalActivityMinutes: number;
  totalDistanceKm: number;
};

function CompactMetricCard({
  label,
  value,
  unit,
  valueClassName,
}: {
  label: string;
  value: string;
  unit: string;
  valueClassName: string;
}) {
  return (
    <DashboardCard className="app-surface-card min-h-[108px] py-5">
      <p className="text-muted text-sm">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${valueClassName}`.trim()}>
        {value} <span className="text-base font-medium text-gray-400">{unit}</span>
      </p>
    </DashboardCard>
  );
}

export function WeeklySection({
  dateRangeLabel,
  sessionsDone,
  sessionsGoal,
  totalActivityMinutes,
  totalDistanceKm,
}: WeeklySectionProps) {
  const safeGoal = Math.max(sessionsGoal, 1);
  const ratio = Math.min(sessionsDone / safeGoal, 1);
  const progressDegrees = Math.round(ratio * 360);

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Cette semaine"
        subtitle={dateRangeLabel}
        titleClassName="text-[36px] font-semibold text-gray-900"
        subtitleClassName="mt-1 text-base text-gray-500"
      />

      <div className="grid gap-4 lg:grid-cols-[42%_58%]">
        <WeeklyProgressCard
          sessionsDone={sessionsDone}
          sessionsGoal={sessionsGoal}
          progressDegrees={progressDegrees}
        />

        <div className="space-y-4">
          <CompactMetricCard
            label="Duree d'activite"
            value={`${totalActivityMinutes}`}
            unit="minutes"
            valueClassName="text-blue-700"
          />
          <CompactMetricCard
            label="Distance"
            value={totalDistanceKm.toFixed(1)}
            unit="kilometres"
            valueClassName="text-red-500"
          />
        </div>
      </div>
    </section>
  );
}
