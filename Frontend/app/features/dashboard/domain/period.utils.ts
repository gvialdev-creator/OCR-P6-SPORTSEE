import type { RunningDataItem } from "../model";

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type SlidingWindowResult = {
  startMs: number | null;
  endMs: number | null;
  sessions: RunningDataItem[];
  canShowPrevious: boolean;
  canShowNext: boolean;
};

export const toTodayIsoDate = (): string => {
  return new Date().toLocaleDateString("en-CA");
};

export const parseIsoDate = (rawDate: string): Date => {
  return new Date(`${rawDate}T00:00:00Z`);
};

export const formatShortDate = (rawDate: string): string => {
  return new Date(rawDate)
    .toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
    .replace(".", "");
};

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

export const formatRangeYearLabel = (startMs: number | null, endMs: number | null): string => {
  if (startMs === null || endMs === null) {
    return "";
  }

  const startYear = new Date(startMs).getUTCFullYear();
  const endYear = new Date(endMs).getUTCFullYear();
  return startYear === endYear ? `${endYear}` : `${startYear} - ${endYear}`;
};

export const getAvailableYears = (sessions: RunningDataItem[]): number[] => {
  return Array.from(
    new Set(sessions.map((session) => new Date(session.date).getFullYear()))
  )
    .filter((year) => !Number.isNaN(year))
    .sort((a, b) => b - a);
};

export const filterSessionsUpToDate = (
  sessions: RunningDataItem[],
  maxIsoDate: string
): RunningDataItem[] => {
  return sessions.filter((session) => session.date <= maxIsoDate);
};

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

export const buildSlidingWindow = (
  sourceSessions: RunningDataItem[],
  offset: number,
  periodDays: number,
  referenceEndMs?: number | null
): SlidingWindowResult => {
  const latestSourceDate = sourceSessions.at(-1)?.date;
  const latestSourceDateMs = latestSourceDate
    ? parseIsoDate(latestSourceDate).getTime()
    : null;
  const baseEndMs = referenceEndMs ?? latestSourceDateMs;

  const endMs =
    baseEndMs !== null && baseEndMs !== undefined
      ? baseEndMs - offset * periodDays * MS_PER_DAY
      : null;
  const startMs =
    endMs !== null ? endMs - (periodDays - 1) * MS_PER_DAY : null;

  const sessions =
    startMs !== null && endMs !== null
      ? sourceSessions.filter((session) => {
          const sessionDateMs = parseIsoDate(session.date).getTime();
          return sessionDateMs >= startMs && sessionDateMs <= endMs;
        })
      : [];

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
    canShowNext: offset > 0,
  };
};