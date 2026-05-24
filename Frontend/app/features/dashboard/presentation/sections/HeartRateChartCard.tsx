import type { HeartRatePoint } from "../../model";
import { Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { DashboardCard } from "../components/DashboardCard";

type HeartRateChartCardProps = {
  averageBpmLabel: string;
  heartRatePoints: HeartRatePoint[];
  heartRangeLabel: string;
  heartRangeYearLabel: string;
  availableHeartYears: number[];
  selectedHeartYear: number | null;
  onSelectHeartYear: (year: number) => void;
  canShowPreviousPeriod: boolean;
  canShowNextPeriod: boolean;
  onShowPreviousPeriod: () => void;
  onShowNextPeriod: () => void;
};

export function HeartRateChartCard({
  averageBpmLabel,
  heartRatePoints,
  heartRangeLabel,
  heartRangeYearLabel,
  availableHeartYears,
  selectedHeartYear,
  onSelectHeartYear,
  canShowPreviousPeriod,
  canShowNextPeriod,
  onShowPreviousPeriod,
  onShowNextPeriod,
}: HeartRateChartCardProps) {
  const chartData = heartRatePoints.map((point) => ({
    label: point.label,
    min: point.min,
    max: point.max,
    avg: point.avg,
  }));

  return (
    <DashboardCard className="app-surface-card h-full min-h-[380px]">
      <div className="ds-chart-header">
        <div>
          <p className="text-3xl font-semibold text-red-500">{averageBpmLabel}</p>
          <p className="text-sm text-muted">Frequence cardiaque moyenne</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="ds-chart-range">
            <button
              type="button"
              className="ds-icon-btn ds-icon-btn-light disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Periode precedente"
              onClick={onShowPreviousPeriod}
              disabled={!canShowPreviousPeriod}
            >
              &#8249;
            </button>
            <span>{heartRangeLabel}</span>
            <button
              type="button"
              className="ds-icon-btn ds-icon-btn-light disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Periode suivante"
              onClick={onShowNextPeriod}
              disabled={!canShowNextPeriod}
            >
              &#8250;
            </button>
          </div>
          {heartRangeYearLabel && availableHeartYears.length > 0 && (
            <label className="text-xs font-medium text-gray-500">
              <span className="mr-2">Annee</span>
              <select
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
                value={selectedHeartYear ?? ""}
                onChange={(event) => onSelectHeartYear(Number(event.target.value))}
                aria-label="Choisir une annee cardio"
              >
                {availableHeartYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-3">
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 6, left: 6, bottom: 0 }}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(30, 68, 255, 0.06)" }}
                formatter={(value, name) => {
                  if (typeof value !== "number") return [value, name];
                  const unit = name === "avg" ? "BPM moy" : name === "min" ? "BPM min" : "BPM max";
                  return [`${value} ${unit}`, unit];
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #ffd7ce",
                  boxShadow: "0 10px 28px rgba(255, 80, 45, 0.16)",
                }}
              />
              <Bar dataKey="min" fill="#f9b7aa" radius={[6, 6, 0, 0]} maxBarSize={10} />
              <Bar dataKey="max" fill="#ff3a12" radius={[6, 6, 0, 0]} maxBarSize={10} />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#1e44ff"
                strokeWidth={2}
                dot={{ r: 2.5, fill: "#1e44ff" }}
                activeDot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="ds-chart-legend">
          <span className="ds-legend-item">
            <span className="ds-legend-dot bg-[#f9b7aa]" />
            Min
          </span>
          <span className="ds-legend-item">
            <span className="ds-legend-dot bg-[#ff3a12]" />
            Max BPM
          </span>
          <span className="ds-legend-item">
            <span className="ds-legend-dot bg-[#1e44ff]" />
            Avg BPM
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}