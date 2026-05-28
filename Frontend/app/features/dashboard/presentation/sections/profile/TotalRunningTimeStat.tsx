import { MetricTile } from "../../components/MetricTile";

type TotalRunningTimeStatProps = {
  value: string;
  variant?: "neutral" | "primary";
};

export function TotalRunningTimeStat({
  value,
  variant = "primary",
}: TotalRunningTimeStatProps) {
  return (
    <MetricTile
      label="Temps total couru"
      value={value}
      unit="min"
      variant={variant}
    />
  );
}
