import type { ReactNode } from "react";
import { DashboardFooter } from "../chrome/DashboardFooter";
import { DashboardHeader } from "../chrome/DashboardHeader";
import type { DataSource } from "../../../model";

type DashboardShellProps = {
  activeStage: "dashboard" | "profile";
  dataSource: DataSource;
  onShowDashboard: () => void;
  onShowProfile: () => void;
  onToggleDataSource: () => void;
  onLogout: () => void;
  children: ReactNode;
};

export function DashboardShell({
  activeStage,
  dataSource,
  onShowDashboard,
  onShowProfile,
  onToggleDataSource,
  onLogout,
  children,
}: DashboardShellProps) {
  return (
    <main className="app-shell">
      <div className="app-container pb-0">
        <DashboardHeader
          activeStage={activeStage}
          dataSource={dataSource}
          onShowDashboard={onShowDashboard}
          onShowProfile={onShowProfile}
          onToggleDataSource={onToggleDataSource}
          onLogout={onLogout}
        />

        <section className="flex-1">{children}</section>

        
      </div>
      <DashboardFooter />
    </main>
  );
}
