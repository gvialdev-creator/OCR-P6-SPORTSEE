import { useEffect, useState } from "react";
import type { User } from "../../../contexts/AuthContext";
import type { DataSource, MockProfileData } from "../model";
import { loadDashboardData } from "../data/dashboard.repository";

type UseProfileDataResult = {
  data: MockProfileData | null;
  isLoading: boolean;
  error: string | null;
};

export function useProfileData(
  source: DataSource,
  user: User | null,
  options?: { enabled?: boolean; includeActivity?: boolean }
): UseProfileDataResult {
  const enabled = options?.enabled ?? true;
  const includeActivity = options?.includeActivity ?? true;
  const userForSource = source === "api" ? user : null;
  const includeActivityForSource = source === "api" ? includeActivity : true;
  const [data, setData] = useState<MockProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    let active = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const normalizedData = await loadDashboardData(source, userForSource, {
          includeActivity: includeActivityForSource,
        });

        if (active) {
          setData(normalizedData);
        }
      } catch (err) {
        if (active) {
          setData(null);
          setError(
            err instanceof Error
              ? err.message
              : "Erreur lors du chargement des donnees"
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [source, userForSource, enabled, includeActivityForSource]);

  return {
    data,
    isLoading,
    error,
  };
}