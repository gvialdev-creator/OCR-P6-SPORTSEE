import { useEffect, useState } from "react";
import api from "../../../services/api";
import type { DataSource, RunningDataItem } from "../model";
import { buildSlidingWindow } from "../domain/period.utils";

const toIsoDateFromMs = (ms: number): string => new Date(ms).toISOString().slice(0, 10);

const activityRangeCache = new Map<string, RunningDataItem[]>();
const activityRangePromiseCache = new Map<string, Promise<RunningDataItem[]>>();

const sortSessionsByDate = (sessions: RunningDataItem[]): RunningDataItem[] => {
  return [...sessions].sort((a, b) => a.date.localeCompare(b.date));
};

type UsePeriodActivityDataResult = {
  sessionsForDisplay: RunningDataItem[];
  window: ReturnType<typeof buildSlidingWindow>;
};

export function usePeriodActivityData(
  dataSource: DataSource,
  sourceSessions: RunningDataItem[],
  periodOffset: number,
  periodDays: number,
  options?: {
    referenceEndMs?: number | null;
    earliestAvailableMs?: number | null;
    preloadedSessions?: RunningDataItem[] | null;
  }
): UsePeriodActivityDataResult {
  const [periodSessions, setPeriodSessions] = useState<RunningDataItem[] | null>(null);

  // La fenêtre courante est calculée à partir des sessions visibles et de l'offset demandé.
  const rawWindow = buildSlidingWindow(
    sourceSessions,
    periodOffset,
    periodDays,
    options?.referenceEndMs
  );
  const canShowPreviousFromBounds =
    options?.earliestAvailableMs !== null && options?.earliestAvailableMs !== undefined
      ? rawWindow.startMs !== null && options.earliestAvailableMs < rawWindow.startMs
      : rawWindow.canShowPrevious;

  const window = {
    ...rawWindow,
    canShowPrevious: canShowPreviousFromBounds,
  };

  const preloadedSessions = options?.preloadedSessions;

  useEffect(() => {
    let active = true;

    const loadPeriodSessions = async () => {
      // En dehors de l'API, on ne charge rien ici: les données sont déjà disponibles côté appelant.
      if (dataSource !== "api" || window.startMs === null || window.endMs === null) {
        if (active) {
          setPeriodSessions(null);
        }
        return;
      }

      // Si le fetch long a déjà chargé toutes les sessions, on filtre localement sans rappel réseau.
      if (preloadedSessions !== null && preloadedSessions !== undefined) {
        const startMs = window.startMs;
        const endMs = window.endMs;
        const filtered = preloadedSessions.filter((session) => {
          const sessionMs = new Date(`${session.date}T00:00:00Z`).getTime();
          return sessionMs >= startMs && sessionMs <= endMs;
        });
        if (active) {
          setPeriodSessions(filtered);
        }
        return;
      }

      try {
        // Fallback historique: on charge uniquement la fenêtre demandée via l'API.
        const startIso = toIsoDateFromMs(window.startMs);
        const endIso = toIsoDateFromMs(window.endMs);
        const cacheKey = `${startIso}|${endIso}`;
        const cachedResponse = activityRangeCache.get(cacheKey);

        if (cachedResponse) {
          // Le cache mémoire évite de refaire un fetch pour une fenêtre déjà connue.
          if (active) {
            setPeriodSessions(cachedResponse);
          }
          return;
        }

        // La promesse partagée évite de déclencher deux appels simultanés pour la même fenêtre.
        const inflight = activityRangePromiseCache.get(cacheKey);
        const requestPromise =
          inflight ??
          (api.getUserActivity(startIso, endIso) as Promise<RunningDataItem[]>).then((items) => {
            const sortedItems = sortSessionsByDate(items);
            activityRangeCache.set(cacheKey, sortedItems);
            return sortedItems;
          });

        if (!inflight) {
          activityRangePromiseCache.set(cacheKey, requestPromise);
        }

        const response = await requestPromise;
        activityRangePromiseCache.delete(cacheKey);

        if (active) {
          setPeriodSessions(response);
        }
      } catch {
        if (window.startMs !== null && window.endMs !== null) {
          const startIso = toIsoDateFromMs(window.startMs);
          const endIso = toIsoDateFromMs(window.endMs);
          activityRangePromiseCache.delete(`${startIso}|${endIso}`);
        }
        if (active) {
          setPeriodSessions([]);
        }
      }
    };

    loadPeriodSessions();

    return () => {
      active = false;
    };
  }, [dataSource, window.startMs, window.endMs, preloadedSessions]);

  return {
    // En mode API, les sessions affichées viennent soit du préchargement, soit du fetch dédié à la fenêtre.
    sessionsForDisplay: dataSource === "api" ? periodSessions ?? [] : sourceSessions,
    window,
  };
}