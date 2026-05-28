import { DashboardCard } from "../../components/DashboardCard";
import { WeeklyProgressHeader } from "./WeeklyProgressHeader";
import { WeeklyProgressLegend } from "./WeeklyProgressLegend";
import { WeeklyProgressRing } from "./WeeklyProgressRing";

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
    <DashboardCard className="app-surface-card min-h-[250px] pt-4 pb-5.5 px-9.5">
      <WeeklyProgressHeader sessionsDone={sessionsDone} sessionsGoal={sessionsGoal} />
      <div className="relative mt-12 flex items-center justify-center">
        <WeeklyProgressRing progressDegrees={progressDegrees} />
        <WeeklyProgressLegend sessionsDone={sessionsDone} sessionsGoal={sessionsGoal} />
      </div>
    </DashboardCard>
  );
}