type WeeklyProgressLegendProps = {
  sessionsDone: number;
  sessionsGoal: number;
};

export function WeeklyProgressLegend({
  sessionsDone,
  sessionsGoal,
}: WeeklyProgressLegendProps) {
  const sessionsRemaining = Math.max(sessionsGoal - sessionsDone, 0);

  return (
    <div className="pointer-events-none absolute inset-0 text-xs text-soft">
      <span className="ds-legend-item absolute right-[calc(50%+74px)] bottom-7 whitespace-nowrap">
        <span className="ds-legend-dot bg-[#1e44ff]" />
        {sessionsDone} realisees
      </span>
      <span className="ds-legend-item absolute top-3 left-[calc(50%+74px)] whitespace-nowrap">
        <span className="ds-legend-dot bg-[#bcc8ff]" />
        {sessionsRemaining} restants
      </span>
    </div>
  );
}
