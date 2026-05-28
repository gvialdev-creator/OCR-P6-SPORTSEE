import type { DataSource } from "../../../model";
import { LogoFull } from "../../../../../components/logos/LogoFull";

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
      <LogoFull />

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
