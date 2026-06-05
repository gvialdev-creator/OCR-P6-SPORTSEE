import type { DistancePoint, HeartRatePoint, RunningDataItem } from "../model";
import {
  buildSlidingWindow,
  formatRangeLabel,
  formatRangeYearLabel,
  MS_PER_DAY,
} from "./period.utils";

const DISTANCE_PERIOD_WEEKS = 4;
const DAYS_PER_WEEK = 7;
const DISTANCE_PERIOD_DAYS = DISTANCE_PERIOD_WEEKS * DAYS_PER_WEEK;
const HEART_PERIOD_DAYS = 7;

export type DistancePeriodData = {
  points: DistancePoint[];
  averageDistancePerWeek: number;
  rangeLabel: string;
  rangeYearLabel: string;
  canShowPrevious: boolean;
  canShowNext: boolean;
};

export type HeartPeriodData = {
  points: HeartRatePoint[];
  averageBpm: number;
  rangeLabel: string;
  rangeYearLabel: string;
  canShowPrevious: boolean;
  canShowNext: boolean;
};

export const buildDistancePeriodData = (
  sourceSessions: RunningDataItem[],
  periodOffset: number,
  referenceEndMs?: number | null
): DistancePeriodData => {
  const window = buildSlidingWindow(
    sourceSessions,
    periodOffset,
    DISTANCE_PERIOD_DAYS,
    referenceEndMs
  );
  const windowEndMs = window.endMs;

  const weeklyBuckets =
    window.startMs !== null && windowEndMs !== null
      ? Array.from({ length: DISTANCE_PERIOD_WEEKS }, (_, index) => {
          const bucketEndMs = windowEndMs - index * DAYS_PER_WEEK * MS_PER_DAY;
          const bucketStartMs = bucketEndMs - (DAYS_PER_WEEK - 1) * MS_PER_DAY;
          const weeklySessions = window.sessions.filter((session) => {
            const sessionDateMs = new Date(`${session.date}T00:00:00Z`).getTime();
            return sessionDateMs >= bucketStartMs && sessionDateMs <= bucketEndMs;
          });

          return {
            label: `S${DISTANCE_PERIOD_WEEKS - index}`,
            value: weeklySessions.reduce((sum, session) => sum + session.distance, 0),
            weekStart: new Date(bucketStartMs).toISOString().slice(0, 10),
            weekEnd: new Date(bucketEndMs).toISOString().slice(0, 10),
          };
        }).reverse()
      : [];

  const averageDistancePerWeek =
    weeklyBuckets.length > 0
      ? weeklyBuckets.reduce((sum, item) => sum + item.value, 0) / weeklyBuckets.length
      : 0;

  return {
    points: weeklyBuckets,
    averageDistancePerWeek,
    rangeLabel: formatRangeLabel(window.startMs, window.endMs),
    rangeYearLabel: formatRangeYearLabel(window.startMs, window.endMs),
    canShowPrevious: window.canShowPrevious,
    canShowNext: window.canShowNext,
  };
};

export const buildHeartPeriodData = (
  sourceSessions: RunningDataItem[],
  periodOffset: number,
  referenceEndMs?: number | null
): HeartPeriodData => {
  const window = buildSlidingWindow(
    sourceSessions,
    periodOffset,
    HEART_PERIOD_DAYS,
    referenceEndMs
  );

  const points: HeartRatePoint[] = window.sessions.map((session) => {
    const weekday = new Date(session.date).toLocaleDateString("fr-FR", {
      weekday: "short",
    });

    return {
      label: `${weekday.charAt(0).toUpperCase()}${weekday.slice(1, 3)}`,
      min: session.heartRate.min,
      max: session.heartRate.max,
      avg: session.heartRate.average,
    };
  });

  const averageBpm =
    window.sessions.length > 0
      ? Math.round(
          window.sessions.reduce((sum, item) => sum + item.heartRate.average, 0) /
            window.sessions.length
        )
      : 0;

  return {
    points,
    averageBpm,
    rangeLabel: formatRangeLabel(window.startMs, window.endMs),
    rangeYearLabel: formatRangeYearLabel(window.startMs, window.endMs),
    canShowPrevious: window.canShowPrevious,
    canShowNext: window.canShowNext,
  };
};