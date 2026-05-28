import { IdentitySection, ProfileDetailsSection, ProfileStatsSection } from "../sections";
import type { ProfileViewModel } from "../../model";

type ProfileViewProps = {
  profile: ProfileViewModel;
  onBackToDashboard: () => void;
};

export function ProfileView({ profile, onBackToDashboard }: ProfileViewProps) {
  return (
    <div className="grid gap-14 md:grid-cols-[9fr_11fr]">
      <div className="min-w-0 space-y-5">
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

      <div className="min-w-0">
        <ProfileStatsSection
          title="Vos statistiques"
          subtitle={profile.memberSinceLabel}
          stats={profile.statTiles}
          variant="primary"
          columnsClassName="md:grid-cols-2"
        />
      </div>
    </div>
  );
}
