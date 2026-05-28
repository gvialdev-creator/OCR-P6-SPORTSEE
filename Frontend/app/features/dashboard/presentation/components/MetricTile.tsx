import type { StatTileData } from "../../model";

type MetricTileProps = StatTileData & {
  variant?: "neutral" | "primary";
};

export function MetricTile({
  label,
  value,
  unit,
  variant = "primary",
}: MetricTileProps) {
  if (variant === "neutral") {
    return (
      <article className="app-surface-card rounded-2xl p-6">
        <p className="text-sm text-soft">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-primary">
          {value} <span className="text-soft text-base font-medium">{unit}</span>
        </p>
      </article>
    );
  }

  return (
    <article className="ds-stat-card ds-stat-card-primary">
      <p className="ds-stat-title">{label}</p>
      <p className="ds-stat-value">
        {value} <span className="ds-stat-unit">{unit}</span>
      </p>
    </article>
  );
}
