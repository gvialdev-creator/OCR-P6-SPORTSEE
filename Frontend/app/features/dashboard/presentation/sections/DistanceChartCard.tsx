import type { DistancePoint } from "../../model";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { DashboardCard } from "../components/DashboardCard";

type DistanceChartCardProps = {
  averageDistanceLabel: string;
  distancePoints: DistancePoint[];
  distanceRangeLabel: string;
  distanceRangeYearLabel: string;
  availableDistanceYears: number[];
  selectedDistanceYear: number | null;
  onSelectDistanceYear: (year: number) => void;
  canShowPreviousPeriod: boolean;
  canShowNextPeriod: boolean;
  onShowPreviousPeriod: () => void;
  onShowNextPeriod: () => void;
};

const formatDistanceTooltipValue = (value: unknown): string => {
  if (typeof value === "number") {
    return `${value.toFixed(1).replace(".", ",")} km`;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return `${parsed.toFixed(1).replace(".", ",")} km`;
    }
  }

  return "0,0 km";
};

export function DistanceChartCard({
  averageDistanceLabel,
  distancePoints,
  distanceRangeLabel,
  distanceRangeYearLabel,
  availableDistanceYears,
  selectedDistanceYear,
  onSelectDistanceYear,
  canShowPreviousPeriod,
  canShowNextPeriod,
  onShowPreviousPeriod,
  onShowNextPeriod,
}: DistanceChartCardProps) {
  return (
    <DashboardCard className="app-surface-card h-full min-h-[380px]">
      <div className="ds-chart-header">
        <div>
          <p className="text-3xl font-semibold text-blue-700">{averageDistanceLabel}</p>
          <p className="text-sm text-muted">Total des kilometres 4 dernieres semaines</p>
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
            <span>{distanceRangeLabel}</span>
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
          {distanceRangeYearLabel && availableDistanceYears.length > 0 && (
            <label className="text-xs font-medium text-gray-500">
              <span className="mr-2">Annee</span>
              <select
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
                value={selectedDistanceYear ?? ""}
                onChange={(event) => onSelectDistanceYear(Number(event.target.value))}
                aria-label="Choisir une annee"
              >
                {availableDistanceYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <div className="h-60 rounded-xl border border-gray-100 bg-white px-3 py-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            key={`${selectedDistanceYear ?? "all"}-${distanceRangeLabel}`}
            data={distancePoints}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            barCategoryGap={20}
          >
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(29, 50, 232, 0.07)" }}
              formatter={(value) => [formatDistanceTooltipValue(value), "Distance"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #dbe2ff",
                boxShadow: "0 10px 28px rgba(40, 70, 255, 0.14)",
              }}
              labelStyle={{ color: "#1f2937", fontWeight: 600 }}
              itemStyle={{ color: "#1d32e8" }}
            />
            <Bar
              dataKey="value"
              fill="#1d32e8"
              radius={[999, 999, 0, 0]}
              maxBarSize={18}
              animationDuration={500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="ds-chart-legend">
        <span className="ds-legend-item">
          <span className="ds-legend-dot bg-[#7789f7]" />
          Km
        </span>
      </div>
    </DashboardCard>
  );
}