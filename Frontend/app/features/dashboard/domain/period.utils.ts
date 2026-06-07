import type { RunningDataItem } from "../model";

// Constante de conversion utilisée dans tous les calculs de plages temporelles.
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type SlidingWindowResult = {
  startMs: number | null;
  endMs: number | null;
  sessions: RunningDataItem[];
  canShowPrevious: boolean;
  canShowNext: boolean;
};

// Retourne la date du jour au format YYYY-MM-DD, compatible avec les comparaisons de chaînes ISO.
export const toTodayIsoDate = (): string => {
  return new Date().toLocaleDateString("en-CA");
};

// Force le parsing en UTC pour éviter les décalages de fuseau horaire lors des comparaisons.
export const parseIsoDate = (rawDate: string): Date => {
  return new Date(`${rawDate}T00:00:00Z`);
};

// Libellé court localisé (ex: "07 juin") utilisé dans les tooltips et légendes de graphes.
export const formatShortDate = (rawDate: string): string => {
  return new Date(rawDate)
    .toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
    .replace(".", "");
};

// Libellé de plage affiché dans les en-têtes de graphes (ex: "05 mai - 07 juin").
export const formatRangeLabel = (startMs: number | null, endMs: number | null): string => {
  if (startMs === null || endMs === null) {
    return "Periode indisponible";
  }

  const start = new Date(startMs);
  const end = new Date(endMs);
  return `${start.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  })} - ${end.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  })}`;
};

// Libellé d'année pour la plage; affiche les deux années si la fenêtre en chevauche deux.
export const formatRangeYearLabel = (startMs: number | null, endMs: number | null): string => {
  if (startMs === null || endMs === null) {
    return "";
  }

  const startYear = new Date(startMs).getUTCFullYear();
  const endYear = new Date(endMs).getUTCFullYear();
  return startYear === endYear ? `${endYear}` : `${startYear} - ${endYear}`;
};

// Extrait les années distinctes présentes dans les sessions, triées de la plus récente à la plus ancienne.
export const getAvailableYears = (sessions: RunningDataItem[]): number[] => {
  return Array.from(
    new Set(sessions.map((session) => new Date(session.date).getFullYear()))
  )
    .filter((year) => !Number.isNaN(year))
    .sort((a, b) => b - a);
};

// Exclut les séances dont la date dépasse le jour courant pour ne pas afficher de données futures.
export const filterSessionsUpToDate = (
  sessions: RunningDataItem[],
  maxIsoDate: string
): RunningDataItem[] => {
  return sessions.filter((session) => session.date <= maxIsoDate);
};

// Filtre les séances par année sélectionnée; retourne toutes les séances si aucune année n'est choisie.
export const filterSessionsByYear = (
  sessions: RunningDataItem[],
  selectedYear: number | null
): RunningDataItem[] => {
  if (selectedYear === null) {
    return sessions;
  }

  return sessions.filter(
    (session) => new Date(session.date).getFullYear() === selectedYear
  );
};

// Calcule une fenêtre glissante de `periodDays` jours décalée de `offset` périodes vers le passé.
export const buildSlidingWindow = (
  sourceSessions: RunningDataItem[],
  offset: number,
  periodDays: number,
  referenceEndMs?: number | null
): SlidingWindowResult => {
  // La date de fin de référence est soit fournie explicitement, soit déduite de la dernière séance connue.
  const latestSourceDate = sourceSessions.at(-1)?.date;
  const latestSourceDateMs = latestSourceDate
    ? parseIsoDate(latestSourceDate).getTime()
    : null;
  const baseEndMs = referenceEndMs ?? latestSourceDateMs;

  // L'offset décale la fenêtre vers le passé: offset=0 → période courante, offset=1 → période précédente.
  const endMs =
    baseEndMs !== null && baseEndMs !== undefined
      ? baseEndMs - offset * periodDays * MS_PER_DAY
      : null;
  const startMs =
    endMs !== null ? endMs - (periodDays - 1) * MS_PER_DAY : null;

  // On garde uniquement les séances dont la date tombe dans la fenêtre [startMs, endMs].
  const sessions =
    startMs !== null && endMs !== null
      ? sourceSessions.filter((session) => {
          const sessionDateMs = parseIsoDate(session.date).getTime();
          return sessionDateMs >= startMs && sessionDateMs <= endMs;
        })
      : [];

  // canShowPrevious est vrai s'il existe des séances antérieures à la fenêtre courante.
  const canShowPrevious =
    startMs !== null
      ? sourceSessions.some(
          (session) => parseIsoDate(session.date).getTime() < startMs
        )
      : false;

  return {
    startMs,
    endMs,
    sessions,
    canShowPrevious,
    // canShowNext est vrai dès qu'on n'est plus sur la période courante.
    canShowNext: offset > 0,
  };
};