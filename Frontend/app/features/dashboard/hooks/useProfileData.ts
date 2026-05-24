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
  user: User | null
): UseProfileDataResult {
  const [data, setData] = useState<MockProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const normalizedData = await loadDashboardData(source, user);

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
  }, [source, user]);

  return {
    data,
    isLoading,
    error,
  };
}