import { DashboardCard } from "../../components/DashboardCard";

type WeeklyDistanceCardProps = {
  totalDistanceKm: number;
};

export function WeeklyDistanceCard({ totalDistanceKm }: WeeklyDistanceCardProps) {
  return (
    <DashboardCard className="app-surface-card min-h-[108px] py-5 px-7.5">
      <p className="text-soft text-sm">Distance</p>
      <p className="mt-4.5 text-[1.375rem] font-medium text-[var(--color-secondary)]">
        {totalDistanceKm.toFixed(1)} <span className="text-base font-medium text-[var(--color-secondary-soft)]">kilometres</span>
      </p>
    </DashboardCard>
  );
}
