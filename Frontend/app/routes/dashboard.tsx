import type { Route } from "./+types/dashboard";
import { DashboardStageManager } from "../features/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - SportSee" },
    { name: "description", content: "Dashboard et profil SportSee" },
  ];
}

export default function Dashboard() {
  return <DashboardStageManager />;
}
