import { MetricTile } from "../../components/MetricTile";

type BurnedCaloriesStatProps = {
  value: string;
  variant?: "neutral" | "primary";
};

export function BurnedCaloriesStat({
  value,
  variant = "primary",
}: BurnedCaloriesStatProps) {
  return (
    <MetricTile
      label="Calories brulees"
      value={value}
      unit="cal"
      variant={variant}
    />
  );
}
