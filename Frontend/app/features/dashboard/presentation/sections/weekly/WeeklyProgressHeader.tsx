type WeeklyProgressHeaderProps = {
  sessionsDone: number;
  sessionsGoal: number;
};

export function WeeklyProgressHeader({
  sessionsDone,
  sessionsGoal,
}: WeeklyProgressHeaderProps) {
  return (
    <>
      <p className="text-4xl font-semibold text-[var(--color-primary)] md:text-5xl">
        x{sessionsDone}{" "}
        <span className="text-base font-medium text-[var(--color-primary-soft)]">
          sur objectif de {sessionsGoal}
        </span>
      </p>
      <p className="text-soft mt-1 text-sm">Courses hebdomadaire realisees</p>
    </>
  );
}
