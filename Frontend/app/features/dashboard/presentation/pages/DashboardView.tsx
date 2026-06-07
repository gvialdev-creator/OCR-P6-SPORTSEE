// Vue principale du dashboard : orchestration des fetchs de données,
// calcul des fenêtres glissantes de distance et de cardio,
// et composition des sections d'affichage.
import { useEffect, useState } from "react";
import type { MockProfileData, RunningDataItem } from "../../model";
import api from "../../../../services/api";
import { DashboardHeroSection, PerformancesSection, WeeklySection } from "../sections";
import {
  buildDistancePeriodData,
  buildHeartPeriodData,
} from "../../domain/aggregations";
import {
  filterSessionsByYear,
  filterSessionsUpToDate,
  getAvailableYears,
  toTodayIsoDate,
} from "../../domain/period.utils";
import { usePeriodActivityData } from "../../hooks/usePeriodActivityData";

/** Props de la vue principale : profil complet et source de données active. */
type DashboardViewProps = {
  data: MockProfileData;
  dataSource: "mock" | "api";
};

/** Accumulateur pour les statistiques des 7 derniers jours. */
type LatestSessionsAggregated = {
  totalActivityMinutes: number;
  weeklyDistanceKm: number;
};

/**
 * Formate la date d'inscription en libellé humain français.
 * Copie locale du mapper, utilisée dans le hero du dashboard.
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

// Durées des fenêtres glissantes : 28 jours pour la distance, 7 pour le cardio.
const DISTANCE_PERIOD_DAYS = 28;
const HEART_PERIOD_DAYS = 7;

// Recul en années et constante milliseconde utilisés quand createdAt est absent ou invalide.
const FALLBACK_YEARS_BACK = 3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Retourne le timestamp UTC de la date de création du profil,
 * ou un fallback 3 ans en arrière si la date est invalide.
 */
const getSafeCreatedAtMs = (createdAt: string, todayMs: number): number => {
  const parsed = new Date(`${createdAt}T00:00:00Z`).getTime();
  if (!Number.isNaN(parsed)) {
    return parsed;
  }
  return todayMs - FALLBACK_YEARS_BACK * 365 * MS_PER_DAY;
};

/**
 * Génère la liste des années couvertes entre createdAt et aujourd'hui.
 * Utilisée en mode API quand aucune session n'est encore disponible localement.
 */
const getAvailableYearsFromBounds = (createdAtMs: number, todayMs: number): number[] => {
  const startYear = new Date(createdAtMs).getUTCFullYear();
  const endYear = new Date(todayMs).getUTCFullYear();

  if (Number.isNaN(startYear) || Number.isNaN(endYear)) {
    return [];
  }

  const years: number[] = [];
  for (let year = endYear; year >= startYear; year -= 1) {
    years.push(year);
  }
  return years;
};

// Bornes UTC du 1er janvier et du 31 décembre pour délimiter une année civile.
const getYearStartMs = (year: number): number => Date.UTC(year, 0, 1);
const getYearEndMs = (year: number): number => Date.UTC(year, 11, 31);

export function DashboardView({ data, dataSource }: DashboardViewProps) {
  // Offsets de navigation dans les fenêtres glissantes (0 = fenêtre la plus récente).
  const [distancePeriodOffset, setDistancePeriodOffset] = useState(0);
  const [heartPeriodOffset, setHeartPeriodOffset] = useState(0);
  // Années sélectionnées dans les filtres (null = toutes années confondues).
  const [selectedDistanceYear, setSelectedDistanceYear] = useState<number | null>(null);
  const [selectedHeartYear, setSelectedHeartYear] = useState<number | null>(null);
  // Distance totale calculée sur toute la période disponible jusqu'à aujourd'hui.
  const [totalDistanceFromStartApi, setTotalDistanceFromStartApi] = useState<number | null>(
    null
  );
  // Cache local des sessions complètes pour réutiliser le fetch long dans les fenêtres glissantes.
  const [allSessionsFromStart, setAllSessionsFromStart] = useState<RunningDataItem[] | null>(null);
  const todayIsoDate = toTodayIsoDate();

  // Tri chronologique des sessions brutes puis exclusion des séances futures.
  const sortedSessions = [...data.runningData].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const visibleSessions = filterSessionsUpToDate(sortedSessions, todayIsoDate);
  const todayMs = new Date(`${todayIsoDate}T00:00:00Z`).getTime();
  // Timestamp de création sécurisé (fallback appliqué si createdAt est invalide).
  const createdAtMs = getSafeCreatedAtMs(data.userInfos.createdAt, todayMs);
  const todayDate = new Date(`${todayIsoDate}T00:00:00Z`);
  const sevenDaysAgoDate = new Date(todayDate);
  sevenDaysAgoDate.setUTCDate(todayDate.getUTCDate() - 6);
  const sevenDaysAgoIsoDate = sevenDaysAgoDate.toISOString().slice(0, 10);
  // Sessions des 7 derniers jours (today - 6 inclus) pour la section hebdomadaire en mode mock.
  const latestSessions = visibleSessions.filter(
    (session) => session.date >= sevenDaysAgoIsoDate
  );

  // En mode API sans sessions locales, les années sont déduites des bornes du profil.
  const yearsFromSessions = getAvailableYears(visibleSessions);
  const fallbackYears = getAvailableYearsFromBounds(createdAtMs, todayMs);
  const availableDistanceYears =
    dataSource === "api" && yearsFromSessions.length === 0
      ? fallbackYears
      : yearsFromSessions;
  const availableHeartYears = [...availableDistanceYears];

  // Réinitialise les offsets et années sélectionnées à chaque changement de profil ou de date.
  useEffect(() => {
    setDistancePeriodOffset(0);
    setHeartPeriodOffset(0);
    setSelectedDistanceYear(availableDistanceYears[0] ?? null);
    setSelectedHeartYear(availableHeartYears[0] ?? null);
  }, [data.id, data.runningData.length, todayIsoDate]);

  useEffect(() => {
    let active = true;

    const loadTotalDistanceFromStart = async () => {
      // Hors API, on ne charge rien et on vide le cache local.
      if (dataSource !== "api") {
        if (active) {
          setTotalDistanceFromStartApi(null);
          setAllSessionsFromStart(null);
        }
        return;
      }

      // Si la date de création est invalide, on se rabat sur la donnée agrégée du backend.
      const createdAtDate = new Date(data.userInfos.createdAt);
      if (Number.isNaN(createdAtDate.getTime())) {
        if (active) {
          setTotalDistanceFromStartApi(data.apiStats?.totalDistanceKm ?? 0);
          setAllSessionsFromStart(null);
        }
        return;
      }

      const startWeek = createdAtDate.toISOString().slice(0, 10);

      try {
        // Fetch long: toutes les sessions depuis la création, bornées à la date du jour.
        const sessions = (await api.getUserActivity(
          startWeek,
          todayIsoDate
        )) as RunningDataItem[];
        const computedTotalDistance = sessions.reduce(
          (sum, item) => sum + item.distance,
          0
        );

        if (active) {
          setTotalDistanceFromStartApi(computedTotalDistance);
          // Les fenêtres glissantes peuvent filtrer localement ces sessions complètes.
          setAllSessionsFromStart([...sessions].sort((a, b) => a.date.localeCompare(b.date)));
        }
      } catch {
        if (active) {
          setTotalDistanceFromStartApi(data.apiStats?.totalDistanceKm ?? 0);
          setAllSessionsFromStart(null);
        }
      }
    };

    loadTotalDistanceFromStart();

    return () => {
      active = false;
    };
  }, [dataSource, data.userInfos.createdAt, data.apiStats?.totalDistanceKm, todayIsoDate]);

  // Restriction des sessions à l'année sélectionnée avant passage au hook de période.
  const distanceSourceSessions = filterSessionsByYear(
    visibleSessions,
    selectedDistanceYear
  );
  const heartSourceSessions = filterSessionsByYear(visibleSessions, selectedHeartYear);

  // Fin de la fenêtre de référence : clampée au 31/12 de l'année sélectionnée ou à aujourd'hui.
  const distanceReferenceEndMs =
    selectedDistanceYear !== null
      ? Math.min(todayMs, getYearEndMs(selectedDistanceYear))
      : todayMs;
  const heartReferenceEndMs =
    selectedHeartYear !== null
      ? Math.min(todayMs, getYearEndMs(selectedHeartYear))
      : todayMs;

  // Début de disponibilité : clampé au 1er janvier de l'année sélectionnée ou à createdAt.
  const distanceEarliestAvailableMs =
    selectedDistanceYear !== null
      ? Math.max(createdAtMs, getYearStartMs(selectedDistanceYear))
      : createdAtMs;
  const heartEarliestAvailableMs =
    selectedHeartYear !== null
      ? Math.max(createdAtMs, getYearStartMs(selectedHeartYear))
      : createdAtMs;

  // Fenêtre glissante de 28 jours pour la distance ; utilise preloadedSessions si disponible.
  const {
    sessionsForDisplay: distanceSessionsForDisplay,
    window: distanceWindow,
  } = usePeriodActivityData(
    dataSource,
    distanceSourceSessions,
    distancePeriodOffset,
    DISTANCE_PERIOD_DAYS,
    dataSource === "api"
      ? {
          referenceEndMs: distanceReferenceEndMs,
          earliestAvailableMs: distanceEarliestAvailableMs,
          preloadedSessions: allSessionsFromStart,
        }
      : undefined
  );

  // Fenêtre glissante de 7 jours pour le cardio ; utilise preloadedSessions si disponible.
  const {
    sessionsForDisplay: heartSessionsForDisplay,
    window: heartWindow,
  } = usePeriodActivityData(
    dataSource,
    heartSourceSessions,
    heartPeriodOffset,
    HEART_PERIOD_DAYS,
    dataSource === "api"
      ? {
          referenceEndMs: heartReferenceEndMs,
          earliestAvailableMs: heartEarliestAvailableMs,
          preloadedSessions: allSessionsFromStart,
        }
      : undefined
  );

  // Agrégation des points de graphe et de la moyenne distance (buckets hebdomadaires sur 4 semaines).
  const distancePeriodData = buildDistancePeriodData(
    distanceSessionsForDisplay,
    dataSource === "api" ? 0 : distancePeriodOffset,
    dataSource === "api" ? distanceWindow.endMs : undefined
  );
  const heartPeriodData = buildHeartPeriodData(
    heartSessionsForDisplay,
    dataSource === "api" ? 0 : heartPeriodOffset,
    dataSource === "api" ? heartWindow.endMs : undefined
  );

  // En API sans sessions locales, on utilise le résultat du fetch long (ou le fallback backend).
  const totalDistance =
    dataSource === "api" && visibleSessions.length === 0
      ? totalDistanceFromStartApi ?? data.apiStats?.totalDistanceKm ?? 0
      : visibleSessions.reduce((sum, item) => sum + item.distance, 0);
  const avgDistancePerWeek = distancePeriodData.averageDistancePerWeek;
  const averageBpm = heartPeriodData.averageBpm;

  // En API sans sessions locales, la fenêtre cardio remplace les 7 derniers jours du mock.
  const weeklySessionsSource =
    dataSource === "api" && visibleSessions.length === 0
      ? heartSessionsForDisplay
      : latestSessions;

  // Agrégation en une passe : durée totale et distance de la semaine.
  const latestSessionsAggregated = weeklySessionsSource.reduce<LatestSessionsAggregated>(
    (acc, session) => {
      acc.totalActivityMinutes += session.duration;
      acc.weeklyDistanceKm += session.distance;
      return acc;
    },
    {
      totalActivityMinutes: 0,
      weeklyDistanceKm: 0,
    } satisfies LatestSessionsAggregated
  );
  const { totalActivityMinutes, weeklyDistanceKm } = latestSessionsAggregated;

  // Libellé "Du X au Y" affiché dans l'en-tête de la section hebdomadaire.
  const rangeEnd = todayIsoDate;
  const rangeStartDate = new Date(`${rangeEnd}T00:00:00Z`);
  rangeStartDate.setUTCDate(rangeStartDate.getUTCDate() - 7);
  const rangeStart = rangeStartDate.toISOString().slice(0, 10);
  const dateRangeLabel =
    rangeStart && rangeEnd
      ? `Du ${new Date(rangeStart).toLocaleDateString("fr-FR")} au ${new Date(
          rangeEnd
        ).toLocaleDateString("fr-FR")}`
      : "Periode indisponible";

  const weeklyGoal = data.weeklyGoal;

  return (
    <div className="space-y-18">
      <DashboardHeroSection
        fullName={`${data.userInfos.firstName} ${data.userInfos.lastName}`}
        memberSinceLabel={formatMemberSince(data.userInfos.createdAt)}
        profilePicture={data.userInfos.profilePicture || "/images/guillaume.webp"}
        totalDistanceLabel={`${Math.round(totalDistance)} km`}
      />

      <PerformancesSection
        averageDistanceLabel={`${Math.round(avgDistancePerWeek)}km en moyenne`}
        distancePoints={distancePeriodData.points}
        distanceRangeLabel={distancePeriodData.rangeLabel}
        distanceRangeYearLabel={distancePeriodData.rangeYearLabel}
        availableDistanceYears={availableDistanceYears}
        selectedDistanceYear={selectedDistanceYear}
        onSelectDistanceYear={(year) => {
          setSelectedDistanceYear(year);
          setDistancePeriodOffset(0);
        }}
        canShowPreviousDistancePeriod={distanceWindow.canShowPrevious}
        canShowNextDistancePeriod={distancePeriodOffset > 0}
        onShowPreviousDistancePeriod={() => {
          if (!distanceWindow.canShowPrevious) return;
          setDistancePeriodOffset((prev) => prev + 1);
        }}
        onShowNextDistancePeriod={() => {
          if (distancePeriodOffset === 0) return;
          setDistancePeriodOffset((prev) => Math.max(prev - 1, 0));
        }}
        averageBpmLabel={`${averageBpm} BPM`}
        heartRatePoints={heartPeriodData.points}
        heartRangeLabel={heartPeriodData.rangeLabel}
        heartRangeYearLabel={heartPeriodData.rangeYearLabel}
        availableHeartYears={availableHeartYears}
        selectedHeartYear={selectedHeartYear}
        onSelectHeartYear={(year) => {
          setSelectedHeartYear(year);
          setHeartPeriodOffset(0);
        }}
        canShowPreviousHeartPeriod={heartWindow.canShowPrevious}
        canShowNextHeartPeriod={heartPeriodOffset > 0}
        onShowPreviousHeartPeriod={() => {
          if (!heartWindow.canShowPrevious) return;
          setHeartPeriodOffset((prev) => prev + 1);
        }}
        onShowNextHeartPeriod={() => {
          if (heartPeriodOffset === 0) return;
          setHeartPeriodOffset((prev) => Math.max(prev - 1, 0));
        }}
      />

      <WeeklySection
        dateRangeLabel={dateRangeLabel}
        sessionsDone={weeklySessionsSource.length}
        sessionsGoal={weeklyGoal}
        totalActivityMinutes={totalActivityMinutes}
        totalDistanceKm={weeklyDistanceKm}
      />


    </div>
  );
}
