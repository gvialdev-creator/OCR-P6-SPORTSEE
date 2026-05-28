import { DashboardCard } from "../../components/DashboardCard";

type WeeklyActivityDurationCardProps = {
  totalActivityMinutes: number;
};

export function WeeklyActivityDurationCard({
  totalActivityMinutes,
}: WeeklyActivityDurationCardProps) {
  return (
    <DashboardCard className="app-surface-card min-h-[108px] py-5 px-7.5">
      <p className="text-soft text-sm">Duree d'activite</p>
      <p className="mt-4.5 text-[1.375rem] font-medium text-[var(--color-primary)]">
        {totalActivityMinutes} <span className="text-base font-medium text-[var(--color-primary-soft)]">minutes</span>
      </p>
    </DashboardCard>
  );
}
