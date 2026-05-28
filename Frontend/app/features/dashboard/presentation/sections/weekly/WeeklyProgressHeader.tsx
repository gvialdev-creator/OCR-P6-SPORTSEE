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
      <p className=" font-semibold text-[var(--color-primary)] text-[1.75rem]">
        x{sessionsDone}{" "}
        <span className="text-base font-medium text-[var(--color-primary-soft)]">
          sur objectif de {sessionsGoal}
        </span>
      </p>
      <p className="text-soft mt-1 text-sm">Courses hebdomadaire realisees</p>
    </>
  );
}
