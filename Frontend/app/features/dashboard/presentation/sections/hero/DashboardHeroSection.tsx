import { DashboardCard } from "../../components/DashboardCard";
import { UserIdentityBlock } from "../../components/UserIdentityBlock";

type DashboardHeroSectionProps = {
  fullName: string;
  memberSinceLabel: string;
  profilePicture: string;
  totalDistanceLabel: string;
};

export function DashboardHeroSection({
  fullName,
  memberSinceLabel,
  profilePicture,
  totalDistanceLabel,
}: DashboardHeroSectionProps) {
  return (
    <DashboardCard className="app-surface-card flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:py-4">
      <UserIdentityBlock
        fullName={fullName}
        memberSinceLabel={memberSinceLabel}
        profilePicture={profilePicture}
        titleClassName="text-[40px] font-semibold leading-tight text-primary"
      />

      <div className="md:text-right flex flex-wrap items-center gap-x-4.5">
        <p className="text-sm text-soft">Distance totale parcourue</p>
        <div className="text-primary mt-2 inline-flex min-w-44 items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-5 text-[30px] font-semibold text-white">
          <span className="hero-distance-content inline-flex items-center">
            <img
              src="/images/pictos/distanceFlag.svg"
              alt="Pictogramme de distance"
              aria-hidden="true"
              className="mr-3 h-7 w-7"
            />
            <span>{totalDistanceLabel}</span>
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}
