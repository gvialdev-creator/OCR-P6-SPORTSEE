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

type DashboardViewProps = {
  data: MockProfileData;
  dataSource: "mock" | "api";
};

type LatestSessionsAggregated = {
  totalActivityMinutes: number;
  weeklyDistanceKm: number;
};

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

const DISTANCE_PERIOD_DAYS = 28;
const HEART_PERIOD_DAYS = 7;

const FALLBACK_YEARS_BACK = 3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const getSafeCreatedAtMs = (createdAt: string, todayMs: number): number => {
  const parsed = new Date(`${createdAt}T00:00:00Z`).getTime();
  if (!Number.isNaN(parsed)) {
    return parsed;
  }
  return todayMs - FALLBACK_YEARS_BACK * 365 * MS_PER_DAY;
};

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

const getYearStartMs = (year: number): number => Date.UTC(year, 0, 1);
const getYearEndMs = (year: number): number => Date.UTC(year, 11, 31);

export function DashboardView({ data, dataSource }: DashboardViewProps) {
  const [distancePeriodOffset, setDistancePeriodOffset] = useState(0);
  const [heartPeriodOffset, setHeartPeriodOffset] = useState(0);
  const [selectedDistanceYear, setSelectedDistanceYear] = useState<number | null>(null);
  const [selectedHeartYear, setSelectedHeartYear] = useState<number | null>(null);
  const [totalDistanceFromStartApi, setTotalDistanceFromStartApi] = useState<number | null>(
    null
  );
  const todayIsoDate = toTodayIsoDate();

  const sortedSessions = [...data.runningData].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const visibleSessions = filterSessionsUpToDate(sortedSessions, todayIsoDate);
  const todayMs = new Date(`${todayIsoDate}T00:00:00Z`).getTime();
  const createdAtMs = getSafeCreatedAtMs(data.userInfos.createdAt, todayMs);
  const todayDate = new Date(`${todayIsoDate}T00:00:00Z`);
  const sevenDaysAgoDate = new Date(todayDate);
  sevenDaysAgoDate.setUTCDate(todayDate.getUTCDate() - 6);
  const sevenDaysAgoIsoDate = sevenDaysAgoDate.toISOString().slice(0, 10);
  const latestSessions = visibleSessions.filter(
    (session) => session.date >= sevenDaysAgoIsoDate
  );

  const yearsFromSessions = getAvailableYears(visibleSessions);
  const fallbackYears = getAvailableYearsFromBounds(createdAtMs, todayMs);
  const availableDistanceYears =
    dataSource === "api" && yearsFromSessions.length === 0
      ? fallbackYears
      : yearsFromSessions;
  const availableHeartYears = [...availableDistanceYears];

  useEffect(() => {
    setDistancePeriodOffset(0);
    setHeartPeriodOffset(0);
    setSelectedDistanceYear(availableDistanceYears[0] ?? null);
    setSelectedHeartYear(availableHeartYears[0] ?? null);
  }, [data.id, data.runningData.length, todayIsoDate]);

  useEffect(() => {
    let active = true;

    const loadTotalDistanceFromStart = async () => {
      if (dataSource !== "api") {
        if (active) {
          setTotalDistanceFromStartApi(null);
        }
        return;
      }

      const createdAtDate = new Date(data.userInfos.createdAt);
      if (Number.isNaN(createdAtDate.getTime())) {
        if (active) {
          setTotalDistanceFromStartApi(data.apiStats?.totalDistanceKm ?? 0);
        }
        return;
      }

      const startWeek = createdAtDate.toISOString().slice(0, 10);

      try {
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
        }
      } catch {
        if (active) {
          setTotalDistanceFromStartApi(data.apiStats?.totalDistanceKm ?? 0);
        }
      }
    };

    loadTotalDistanceFromStart();

    return () => {
      active = false;
    };
  }, [dataSource, data.userInfos.createdAt, data.apiStats?.totalDistanceKm, todayIsoDate]);

  const distanceSourceSessions = filterSessionsByYear(
    visibleSessions,
    selectedDistanceYear
  );
  const heartSourceSessions = filterSessionsByYear(visibleSessions, selectedHeartYear);

  const distanceReferenceEndMs =
    selectedDistanceYear !== null
      ? Math.min(todayMs, getYearEndMs(selectedDistanceYear))
      : todayMs;
  const heartReferenceEndMs =
    selectedHeartYear !== null
      ? Math.min(todayMs, getYearEndMs(selectedHeartYear))
      : todayMs;

  const distanceEarliestAvailableMs =
    selectedDistanceYear !== null
      ? Math.max(createdAtMs, getYearStartMs(selectedDistanceYear))
      : createdAtMs;
  const heartEarliestAvailableMs =
    selectedHeartYear !== null
      ? Math.max(createdAtMs, getYearStartMs(selectedHeartYear))
      : createdAtMs;

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
        }
      : undefined
  );

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
        }
      : undefined
  );

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

  const totalDistance =
    dataSource === "api" && visibleSessions.length === 0
      ? totalDistanceFromStartApi ?? data.apiStats?.totalDistanceKm ?? 0
      : visibleSessions.reduce((sum, item) => sum + item.distance, 0);
  const avgDistancePerWeek = distancePeriodData.averageDistancePerWeek;
  const averageBpm = heartPeriodData.averageBpm;

  const weeklySessionsSource =
    dataSource === "api" && visibleSessions.length === 0
      ? heartSessionsForDisplay
      : latestSessions;

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
