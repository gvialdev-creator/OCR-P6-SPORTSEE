import { MetricTile } from "../../components/MetricTile";

type SessionCountStatProps = {
  value: string;
  variant?: "neutral" | "primary";
};

export function SessionCountStat({
  value,
  variant = "primary",
}: SessionCountStatProps) {
  return (
    <MetricTile
      label="Nombre de sessions"
      value={value}
      unit="sessions"
      variant={variant}
    />
  );
}
