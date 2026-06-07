// Transforme les données brutes du profil (mock ou API normalisée) en ViewModel
// prêt à l'affichage dans les composants React du dashboard.
import type { MockProfileData, ProfileViewModel } from "../model";
import {
  filterSessionsUpToDate,
  parseIsoDate,
  toTodayIsoDate,
} from "../domain/period.utils";

/**
 * Formate la date d'inscription en libellé humain français.
 * Retourne "Membre depuis date inconnue" si la date est invalide.
 */
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

/**
 * Convertit un nombre de minutes en objet { value: "Xh Y", unit: "min" }
 * pour l'affichage dans les tuiles de statistiques.
 */
const formatDuration = (totalMinutes: number): { value: string; unit: string } => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return {
    value: `${hours}h ${minutes}`,
    unit: "min",
  };
};

/** Accumulateur intermédiaire utilisé par le reduce d'agrégation des sessions. */
type ProfileSessionsAggregated = {
  totalMinutes: number;
  totalCalories: number;
  totalDistance: number;
  totalSessions: number;
};

/**
 * Calcule le nombre total de jours sans activité entre deux séances consécutives.
 * Déduplique les dates, les trie, puis somme les écarts supérieurs à 1 jour.
 * Retourne 0 si moins de deux séances distinctes existent.
 */
const calculateRestDays = (sessions: MockProfileData["runningData"]): number => {
  if (sessions.length < 2) {
    return 0;
  }

  const uniqueDates = Array.from(new Set(sessions.map((session) => session.date))).sort();

  return uniqueDates.slice(1).reduce((sum, currentDate, index) => {
    const previousDate = uniqueDates[index];
    const diffDays = Math.round(
      (parseIsoDate(currentDate).getTime() - parseIsoDate(previousDate).getTime()) /
        (24 * 60 * 60 * 1000)
    );
    return sum + Math.max(diffDays - 1, 0);
  }, 0);
};

/**
 * Point d'entrée principal du mapper.
 * Filtre les séances jusqu'à aujourd'hui, agrège les totaux,
 * calcule les jours de repos, puis construit le ProfileViewModel
 * consommé par les composants d'affichage.
 */
export const mapProfileDataToViewModel = (
  data: MockProfileData
): ProfileViewModel => {
  // Tri chronologique puis exclusion des séances dont la date dépasse aujourd'hui.
  const sortedSessions = [...data.runningData].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const visibleSessions = filterSessionsUpToDate(sortedSessions, toTodayIsoDate());

  // Agrégation en une seule passe : durée, calories, distance et nombre de séances.
  const aggregated = visibleSessions.reduce<ProfileSessionsAggregated>(
    (acc, item) => {
      acc.totalMinutes += item.duration;
      acc.totalCalories += item.caloriesBurned;
      acc.totalDistance += item.distance;
      acc.totalSessions += 1;
      return acc;
    },
    {
      totalMinutes: 0,
      totalCalories: 0,
      totalDistance: 0,
      totalSessions: 0,
    } satisfies ProfileSessionsAggregated
  );

  const { totalMinutes, totalCalories, totalDistance, totalSessions } = aggregated;
  const restDays = calculateRestDays(visibleSessions);
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
