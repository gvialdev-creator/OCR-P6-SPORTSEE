import { IdentitySection, ProfileDetailsSection, ProfileStatsSection } from "../sections";
import type { ProfileViewModel } from "../../model";

type ProfileViewProps = {
  profile: ProfileViewModel;
  onBackToDashboard: () => void;
};

export function ProfileView({ profile, onBackToDashboard }: ProfileViewProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[46%_54%]">
      <div className="space-y-5">
        <IdentitySection
          fullName={profile.fullName}
          memberSinceLabel={profile.memberSinceLabel}
          profilePicture={profile.profilePicture}
        />

        <ProfileDetailsSection
          age={profile.age}
          gender={profile.gender}
          heightLabel={profile.heightLabel}
          weightLabel={profile.weightLabel}
        />
      </div>

      <ProfileStatsSection
        title="Vos statistiques"
        subtitle={profile.memberSinceLabel}
        stats={profile.statTiles}
        variant="primary"
        columnsClassName="md:grid-cols-2"        
      />
    </div>
  );
}
