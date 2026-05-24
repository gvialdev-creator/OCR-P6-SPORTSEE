import type { DataSource } from "../../model";

type DashboardHeaderProps = {
  activeStage: "dashboard" | "profile";
  dataSource: DataSource;
  onShowDashboard: () => void;
  onShowProfile: () => void;
  onToggleDataSource: () => void;
  onLogout: () => void;
};

export function DashboardHeader({
  activeStage,
  dataSource,
  onShowDashboard,
  onShowProfile,
  onToggleDataSource,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="mb-10 flex flex-wrap items-center justify-between gap-4 lg:mb-14">
      <div className="flex items-end gap-2 text-blue-700">
        <span className="mb-0.5 flex items-end gap-0.5" aria-hidden="true">
          <span className="h-3 w-0.5 rounded-full bg-red-500" />
          <span className="h-4.5 w-0.5 rounded-full bg-red-300" />
          <span className="h-5.5 w-0.5 rounded-full bg-blue-700" />
          <span className="h-4 w-0.5 rounded-full bg-red-400" />
        </span>
        <span className="text-4xl font-black uppercase tracking-tight">SportSee</span>
      </div>

      <nav className="ds-nav">
        <ul className="ds-nav-list md:gap-4">
          <li>
            <button
              type="button"
              onClick={onShowDashboard}
              className={`ds-nav-item ${activeStage === "dashboard" ? "is-active" : ""}`}
            >
              Dashboard
            </button>
          </li>
          <li className="ds-nav-divider" aria-hidden="true" />
          <li>
            <button
              type="button"
              onClick={onShowProfile}
              className={`ds-nav-item ${activeStage === "profile" ? "is-active" : ""}`}
            >
              Mon profil
            </button>
          </li>
          <li className="ds-nav-divider" aria-hidden="true" />
          <li>
            <button
              type="button"
              onClick={onLogout}
              className="ds-nav-item text-primary"
            >
              Se deconnecter
            </button>
          </li>
          <li className="ds-nav-divider" aria-hidden="true" />
          <li>
            <button
              type="button"
              onClick={onToggleDataSource}
              className="ds-nav-item"
              aria-label="Basculer la source des donnees"
            >
              Source: {dataSource === "api" ? "API" : "Mock"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
