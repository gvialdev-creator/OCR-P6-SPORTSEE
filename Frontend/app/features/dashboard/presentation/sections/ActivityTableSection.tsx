import type { MockProfileData } from "../../model";
import { DashboardCard } from "../components/DashboardCard";
import { SectionHeader } from "../components/SectionHeader";

type ActivityTableSectionProps = {
  sessions: MockProfileData["runningData"];
  onShowProfile: () => void;
};

export function ActivityTableSection({
  sessions,
  onShowProfile,
}: ActivityTableSectionProps) {
  return (
    <DashboardCard>
      <div className="mb-4 flex items-center justify-between gap-4">
        <SectionHeader title="Vos sessions recentes" />
        <button
          type="button"
          onClick={onShowProfile}
          className="rounded-full bg-blue-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
        >
          Voir le profil
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-3 pr-3">Date</th>
              <th className="py-3 pr-3">Distance</th>
              <th className="py-3 pr-3">Duree</th>
              <th className="py-3 pr-3">Calories</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr
                key={`${session.date}-${session.duration}`}
                className="border-b border-gray-100 text-gray-700"
              >
                <td className="py-3 pr-3">{session.date}</td>
                <td className="py-3 pr-3">{session.distance} km</td>
                <td className="py-3 pr-3">{session.duration} min</td>
                <td className="py-3 pr-3">{session.caloriesBurned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
