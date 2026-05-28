type WeeklyProgressRingProps = {
  progressDegrees: number;
};

export function WeeklyProgressRing({ progressDegrees }: WeeklyProgressRingProps) {
  const normalizedProgress = Math.max(0, Math.min(progressDegrees, 360));
  const leftSideAngle = 270;
  const startAngle = leftSideAngle - normalizedProgress / 2;

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative h-40.5 w-40.5 rounded-full"
        style={{
          background: `conic-gradient(from ${startAngle}deg, var(--color-primary) ${normalizedProgress}deg, var(--color-primary-soft) ${normalizedProgress}deg)`,
        }}
        aria-label="Progression hebdomadaire"
      >
        <div className="absolute inset-10 rounded-full bg-white" />
      </div>
    </div>
  );
}
