import { DashboardCard } from "../components/DashboardCard";

type WeeklyProgressCardProps = {
  sessionsDone: number;
  sessionsGoal: number;
  progressDegrees: number;
};

export function WeeklyProgressCard({
  sessionsDone,
  sessionsGoal,
  progressDegrees,
}: WeeklyProgressCardProps) {
  return (
    <DashboardCard className="app-surface-card min-h-[250px]">
      <p className="text-4xl font-semibold text-blue-700 md:text-5xl">
        x{sessionsDone} <span className="text-base font-medium text-blue-300">sur objectif de {sessionsGoal}</span>
      </p>
      <p className="text-muted mt-1 text-sm">Courses hebdomadaire realisees</p>

      <div className="mt-6 flex items-center justify-center">
        <div
          className="relative h-36 w-36 rounded-full"
          style={{
            background: `conic-gradient(#1e44ff ${progressDegrees}deg, #bcc8ff ${progressDegrees}deg)`,
          }}
          aria-label="Progression hebdomadaire"
        >
          <div className="absolute inset-5 rounded-full bg-white" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span className="ds-legend-item">
          <span className="ds-legend-dot bg-[#1e44ff]" />
          {sessionsDone} realisees
        </span>
        <span className="ds-legend-item">
          <span className="ds-legend-dot bg-[#bcc8ff]" />
          {Math.max(sessionsGoal - sessionsDone, 0)} restants
        </span>
      </div>
    </DashboardCard>
  );
}