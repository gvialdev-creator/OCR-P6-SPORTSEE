import { MetricTile } from "../../components/MetricTile";

type RestDaysStatProps = {
  value: string;
  variant?: "neutral" | "primary";
};

export function RestDaysStat({
  value,
  variant = "primary",
}: RestDaysStatProps) {
  return (
    <MetricTile
      label="Nombre de jours de repos"
      value={value}
      unit="jours"
      variant={variant}
    />
  );
}
