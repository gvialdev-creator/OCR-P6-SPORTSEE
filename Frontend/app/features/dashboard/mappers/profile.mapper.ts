import type { MockProfileData, ProfileViewModel } from "../model";

const formatMemberSince = (createdAt: string): string => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return "Membre depuis date inconnue";
  }

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `Membre depuis le ${formatter.format(date)}`;
};

const formatDuration = (totalMinutes: number): { value: string; unit: string } => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return {
    value: `${hours}h ${minutes}`,
    unit: "min",
  };
};

export const mapProfileDataToViewModel = (
  data: MockProfileData
): ProfileViewModel => {
  const totalMinutes = data.runningData.reduce((sum, item) => sum + item.duration, 0);
  const totalCalories = data.runningData.reduce(
    (sum, item) => sum + item.caloriesBurned,
    0
  );
  const totalDistance = data.runningData.reduce((sum, item) => sum + item.distance, 0);
  const totalSessions = data.runningData.length;
  const restDays = Math.max(0, 14 - totalSessions);
  const duration = formatDuration(totalMinutes);

  return {
    fullName: `${data.userInfos.firstName} ${data.userInfos.lastName}`,
    memberSinceLabel: formatMemberSince(data.userInfos.createdAt),
    age: data.userInfos.age,
    gender: data.userInfos.gender,
    heightLabel: `${(data.userInfos.height / 100).toFixed(2).replace(".", ",")}m`,
    weightLabel: `${data.userInfos.weight}kg`,
    profilePicture: data.userInfos.profilePicture || "/images/guillaume.webp",
    statTiles: [
      {
        label: "Temps total couru",
        value: duration.value,
        unit: duration.unit,
      },
      {
        label: "Calories brulees",
        value: `${totalCalories}`,
        unit: "cal",
      },
      {
        label: "Distance totale parcourue",
        value: `${Math.round(totalDistance)}`,
        unit: "km",
      },
      {
        label: "Nombre de jours de repos",
        value: `${restDays}`,
        unit: "jours",
      },
      {
        label: "Nombre de sessions",
        value: `${totalSessions}`,
        unit: "sessions",
      },
    ],
  };
};
