import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../../contexts/AuthContext";
import { DashboardShell } from "../../layout";
import { DashboardView, ProfileView } from "../../pages";
import { mapProfileDataToViewModel } from "../../../mappers";
import { StageTransition } from "./StageTransition";
import type { DataSource, Stage } from "../../../model";
import { useProfileData } from "../../../hooks/useProfileData";

const DATA_SOURCE_KEY = "dashboardDataSource";

const getInitialDataSource = (): DataSource => {
  if (typeof window === "undefined") {
    return "mock";
  }

  const storedSource = localStorage.getItem(DATA_SOURCE_KEY);
  return storedSource === "api" ? "api" : "mock";
};

export function DashboardStageManager() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeStage, setActiveStage] = useState<Stage>("dashboard");
  const [dataSource, setDataSource] = useState<DataSource>(getInitialDataSource);
  const { data, isLoading, error } = useProfileData(dataSource, user);

  const handleToggleDataSource = () => {
    setDataSource((prevSource) => {
      const nextSource: DataSource = prevSource === "mock" ? "api" : "mock";

      if (typeof window !== "undefined") {
        localStorage.setItem(DATA_SOURCE_KEY, nextSource);
      }

      return nextSource;
    });
  };

  const profileViewModel = useMemo(() => {
    if (!data) return null;
    return mapProfileDataToViewModel(data);
  }, [data]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <DashboardShell
      activeStage={activeStage}
      dataSource={dataSource}
      onShowDashboard={() => setActiveStage("dashboard")}
      onShowProfile={() => setActiveStage("profile")}
      onToggleDataSource={handleToggleDataSource}
      onLogout={handleLogout}
    >
      {isLoading && (
        <div className="rounded-2xl bg-white p-6 text-gray-600 shadow-sm">
          Chargement des donnees...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && data && profileViewModel && (
        <StageTransition stageKey={activeStage}>
          {activeStage === "dashboard" ? (
            <DashboardView data={data} />
          ) : (
            <ProfileView
              profile={profileViewModel}
              onBackToDashboard={() => setActiveStage("dashboard")}
            />
          )}
        </StageTransition>
      )}
    </DashboardShell>
  );
}
