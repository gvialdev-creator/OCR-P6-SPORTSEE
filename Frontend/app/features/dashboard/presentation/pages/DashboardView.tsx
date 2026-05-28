import { useEffect, useState } from "react";
import type { MockProfileData } from "../../model";
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

type DashboardViewProps = {
  data: MockProfileData;
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

export function DashboardView({ data }: DashboardViewProps) {
  const [distancePeriodOffset, setDistancePeriodOffset] = useState(0);
  const [heartPeriodOffset, setHeartPeriodOffset] = useState(0);
  const [selectedDistanceYear, setSelectedDistanceYear] = useState<number | null>(null);
  const [selectedHeartYear, setSelectedHeartYear] = useState<number | null>(null);
  const todayIsoDate = toTodayIsoDate();

  const sortedSessions = [...data.runningData].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const visibleSessions = filterSessionsUpToDate(sortedSessions, todayIsoDate);
  const todayDate = new Date(`${todayIsoDate}T00:00:00Z`);
  const sevenDaysAgoDate = new Date(todayDate);
  sevenDaysAgoDate.setUTCDate(todayDate.getUTCDate() - 6);
  const sevenDaysAgoIsoDate = sevenDaysAgoDate.toISOString().slice(0, 10);
  const latestSessions = visibleSessions.filter(
    (session) => session.date >= sevenDaysAgoIsoDate
  );

  const availableDistanceYears = getAvailableYears(visibleSessions);
  const availableHeartYears = [...availableDistanceYears];

  useEffect(() => {
    setDistancePeriodOffset(0);
    setHeartPeriodOffset(0);
    setSelectedDistanceYear(availableDistanceYears[0] ?? null);
    setSelectedHeartYear(availableHeartYears[0] ?? null);
  }, [data.id, data.runningData.length, todayIsoDate]);

  const distanceSourceSessions = filterSessionsByYear(
    visibleSessions,
    selectedDistanceYear
  );
  const heartSourceSessions = filterSessionsByYear(visibleSessions, selectedHeartYear);

  const distancePeriodData = buildDistancePeriodData(
    distanceSourceSessions,
    distancePeriodOffset
  );
  const heartPeriodData = buildHeartPeriodData(heartSourceSessions, heartPeriodOffset);

  const totalDistance = visibleSessions.reduce((sum, item) => sum + item.distance, 0);
  const avgDistancePerWeek = distancePeriodData.averageDistancePerWeek;
  const averageBpm = heartPeriodData.averageBpm;

  const latestSessionsAggregated = latestSessions.reduce<LatestSessionsAggregated>(
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
    <div className="space-y-10">
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
        canShowPreviousDistancePeriod={distancePeriodData.canShowPrevious}
        canShowNextDistancePeriod={distancePeriodData.canShowNext}
        onShowPreviousDistancePeriod={() => {
          if (!distancePeriodData.canShowPrevious) return;
          setDistancePeriodOffset((prev) => {
            const nextOffset = prev + 1;
            return Math.min(nextOffset, Math.max(distanceSourceSessions.length - 1, 0));
          });
        }}
        onShowNextDistancePeriod={() => {
          if (!distancePeriodData.canShowNext) return;
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
        canShowPreviousHeartPeriod={heartPeriodData.canShowPrevious}
        canShowNextHeartPeriod={heartPeriodData.canShowNext}
        onShowPreviousHeartPeriod={() => {
          if (!heartPeriodData.canShowPrevious) return;
          setHeartPeriodOffset((prev) => prev + 1);
        }}
        onShowNextHeartPeriod={() => {
          if (!heartPeriodData.canShowNext) return;
          setHeartPeriodOffset((prev) => Math.max(prev - 1, 0));
        }}
      />

      <WeeklySection
        dateRangeLabel={dateRangeLabel}
        sessionsDone={latestSessions.length}
        sessionsGoal={weeklyGoal}
        totalActivityMinutes={totalActivityMinutes}
        totalDistanceKm={weeklyDistanceKm}
      />
    </div>
  );
}
