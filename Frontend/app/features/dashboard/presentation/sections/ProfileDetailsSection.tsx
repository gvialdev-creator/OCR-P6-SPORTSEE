import { DashboardCard } from "../components/DashboardCard";

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
    <DashboardCard>
      <h2 className="text-4xl font-semibold text-gray-900">Votre profil</h2>
      <div className="my-5 h-px bg-gray-200" />
      <div className="space-y-4 text-2xl text-gray-600">
        <p>Age : {age}</p>
        <p>Genre : {gender}</p>
        <p>Taille : {heightLabel}</p>
        <p>Poids : {weightLabel}</p>
      </div>
    </DashboardCard>
  );
}
