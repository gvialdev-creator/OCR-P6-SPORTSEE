// Importation des bibliothèques nécessaires
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../../contexts/AuthContext";
import { DashboardShell } from "../../layout";
import { DashboardView, ProfileView } from "../../pages";
import { mapProfileDataToViewModel } from "../../../mappers";
import { StageTransition } from "./StageTransition";
import type { DataSource, Stage } from "../../../model";
import { useProfileData } from "../../../hooks/useProfileData";

// Constante pour stocker la clé de l'élément de stockage local
const DATA_SOURCE_KEY = "dashboardDataSource";

// Fonction pour obtenir le source initial de données
const getInitialDataSource = (): DataSource => {
  if (typeof window === "undefined") {
    return "api";
  }

  const storedSource = localStorage.getItem(DATA_SOURCE_KEY);
  return storedSource === "mock" ? "mock" : "api";
};

// Composant DashboardStageManager qui gère les étapes et la navigation
export function DashboardStageManager() {
  // Utilisation du hook useNavigate pour naviguer entre les pages
  const navigate = useNavigate();
  
  // Utilisation du hook useAuth pour accéder à l'état d'authentification de l'utilisateur
  const { logout, user, isLoading: isAuthLoading } = useAuth();

  // État pour suivre l'étape active (dashboard ou profile)
  const [activeStage, setActiveStage] = useState<Stage>("dashboard");
  
  // État pour suivre le source de données actif (mock ou api)
  const [dataSource, setDataSource] = useState<DataSource>(getInitialDataSource);
  
  // Utilisation du hook useProfileData pour récupérer les données utilisateur
  const { data, isLoading, error } = useProfileData(dataSource, user, {
    enabled: !isAuthLoading,
    includeActivity: activeStage === "profile",
  });

  // Fonction pour basculer entre le source de données mock et api
  const handleToggleDataSource = () => {
    setDataSource((prevSource) => {
      const nextSource: DataSource = prevSource === "mock" ? "api" : "mock";

      if (typeof window !== "undefined") {
        localStorage.setItem(DATA_SOURCE_KEY, nextSource);
      }

      return nextSource;
    });
  };

  // Mémoire tampon pour convertir les données utilisateur en un modèle de vue
  const profileViewModel = useMemo(() => {
    if (!data || activeStage !== "profile") return null;
    return mapProfileDataToViewModel(data);
  }, [activeStage, data]);

  // État pour suivre si la page est en chargement
  const isPageLoading = isAuthLoading || isLoading;

  // Fonction pour déconnecter l'utilisateur et naviguer vers la page d'accueil
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Rendu du composant DashboardShell avec les props appropriées
  return (
    <DashboardShell
      activeStage={activeStage}
      dataSource={dataSource}
      onShowDashboard={() => setActiveStage("dashboard")}
      onShowProfile={() => setActiveStage("profile")}
      onToggleDataSource={handleToggleDataSource}
      onLogout={handleLogout}
    >
      {isPageLoading && (
        <div className="rounded-2xl bg-white p-6 text-gray-600 shadow-sm">
          Chargement des données...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {!isPageLoading && !error && data && (
        <StageTransition stageKey={activeStage}>
          {activeStage === "dashboard" ? (
            <DashboardView data={data} dataSource={dataSource} />
          ) : profileViewModel ? (
            <ProfileView
              profile={profileViewModel}
              onBackToDashboard={() => setActiveStage("dashboard")}
            />
          ) : null}
        </StageTransition>
      )}
    </DashboardShell>
  );
}
