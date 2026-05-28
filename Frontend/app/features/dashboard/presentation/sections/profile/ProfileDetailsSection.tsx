import { DashboardCard } from "../../components/DashboardCard";

type ProfileDetailsSectionProps = {
  age: number;
  gender: string;
  heightLabel: string;
  weightLabel: string;
};

export function ProfileDetailsSection({
  age,
  gender,
  heightLabel,
  weightLabel,
}: ProfileDetailsSectionProps) {
  return (
    <DashboardCard className="app-surface-card py-10 px-7">
      <h2 className="text-[1.375rem] font-medium text-primary">Votre profil</h2>
      <div className="my-5 h-px bg-gray-200" />
      <div className="space-y-4 text-base text-soft">
        <p>Age : {age}</p>
        <p>Genre : {gender}</p>
        <p>Taille : {heightLabel}</p>
        <p>Poids : {weightLabel}</p>
      </div>
    </DashboardCard>
  );
}
