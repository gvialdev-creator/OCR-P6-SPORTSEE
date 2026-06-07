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
  // En mode mock, on n'envoie pas l'utilisateur au backend API.
  const userForSource = source === "api" ? user : null;
  // L'activité n'est utile que côté API; en mock on charge toujours l'ensemble des données.
  const includeActivityForSource = source === "api" ? includeActivity : true;
  const [data, setData] = useState<MockProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si le chargement est désactivé, on sort immédiatement sans lancer de requête.
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    let active = true;

    const loadData = async () => {
      // On réinitialise l'état avant chaque nouveau chargement.
      setIsLoading(true);
      setError(null);

      try {
        // Le repository choisit ensuite la bonne source et applique les options.
        const normalizedData = await loadDashboardData(source, userForSource, {
          includeActivity: includeActivityForSource,
        });

        if (active) {
          setData(normalizedData);
        }
      } catch (err) {
        if (active) {
          // En cas d'erreur, on vide la donnée et on expose un message exploitable.
          setData(null);
          setError(
            err instanceof Error
              ? err.message
              : "Erreur lors du chargement des donnees"
          );
        }
      } finally {
        if (active) {
          // On clôture le cycle de chargement uniquement si le composant est toujours monté.
          setIsLoading(false);
        }
      }
    };

    // Le flag active évite de mettre à jour l'état si le composant a déjà été démonté.
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