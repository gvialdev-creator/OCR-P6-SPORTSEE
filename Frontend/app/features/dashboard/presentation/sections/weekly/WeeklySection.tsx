import { SectionHeader } from "../../components/SectionHeader";
import { WeeklyActivityDurationCard } from "./WeeklyActivityDurationCard";
import { WeeklyDistanceCard } from "./WeeklyDistanceCard";
import { WeeklyProgressCard } from "./WeeklyProgressCard";

type WeeklySectionProps = {
  dateRangeLabel: string;
  sessionsDone: number;
  sessionsGoal: number;
  totalActivityMinutes: number;
  totalDistanceKm: number;
};

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
        titleClassName="text-[36px] font-semibold text-primary"
        subtitleClassName="mt-1 text-base text-soft"
      />

      <div className="grid gap-4 lg:grid-cols-[42%_58%]">
        <WeeklyProgressCard
          sessionsDone={sessionsDone}
          sessionsGoal={sessionsGoal}
          progressDegrees={progressDegrees}
        />

        <div className="space-y-4">
          <WeeklyActivityDurationCard totalActivityMinutes={totalActivityMinutes} />
          <WeeklyDistanceCard totalDistanceKm={totalDistanceKm} />
        </div>
      </div>
    </section>
  );
}
