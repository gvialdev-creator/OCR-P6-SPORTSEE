import { MetricTile } from "../../components/MetricTile";

type TotalDistanceStatProps = {
  value: string;
  variant?: "neutral" | "primary";
};

export function TotalDistanceStat({
  value,
  variant = "primary",
}: TotalDistanceStatProps) {
  return (
    <MetricTile
      label="Distance totale parcourue"
      value={value}
      unit="km"
      variant={variant}
    />
  );
}
