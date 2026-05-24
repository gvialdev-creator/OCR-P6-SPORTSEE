import { DashboardCard } from "../components/DashboardCard";
import { UserIdentityBlock } from "../components/UserIdentityBlock";

type IdentitySectionProps = {
  fullName: string;
  memberSinceLabel: string;
  profilePicture: string;
};

export function IdentitySection({
  fullName,
  memberSinceLabel,
  profilePicture,
}: IdentitySectionProps) {
  return (
    <DashboardCard>
      <UserIdentityBlock
        fullName={fullName}
        memberSinceLabel={memberSinceLabel}
        profilePicture={profilePicture}
      />
    </DashboardCard>
  );
}
