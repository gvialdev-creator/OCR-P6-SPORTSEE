import type { DistancePoint } from "../../../model";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardCard } from "../../components/DashboardCard";
import { MeasuredChartContainer } from "../../components/MeasuredChartContainer";

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

const DISTANCE_TICK_STEP = 10;
const DISTANCE_BASE_MAX = 30;

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

const formatIsoDayMonth = (isoDate: string): string => {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const [, month, day] = parts;
  return `${day}.${month}`;
};

type DistanceTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value?: number | string;
    payload?: DistancePoint;
  }>;
};

function DistanceTooltip({ active, payload }: DistanceTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload;
  if (!point) {
    return null;
  }

  return (
    <div className="min-w-[122px] rounded-[12px] bg-black/92 px-4 py-3 text-white shadow-[0_10px_26px_rgba(0,0,0,0.35)]">
      <p className="text-[0.75rem] leading-tight text-white/65">
        {formatIsoDayMonth(point.weekStart)} au {formatIsoDayMonth(point.weekEnd)}
      </p>
      <p className="mt-1 text-[1.25rem] leading-none font-medium tracking-[-0.02em]">
        {formatDistanceTooltipValue(point.value)}
      </p>
    </div>
  );
}

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
  const distanceMaxValue = distancePoints.reduce((max, point) => Math.max(max, point.value), 0);
  const distanceYAxisMax = Math.max(
    DISTANCE_BASE_MAX,
    Math.ceil(distanceMaxValue / DISTANCE_TICK_STEP) * DISTANCE_TICK_STEP
  );
  const distanceTicks = Array.from(
    { length: distanceYAxisMax / DISTANCE_TICK_STEP + 1 },
    (_, index) => index * DISTANCE_TICK_STEP
  );

  return (
    <DashboardCard className="app-surface-card h-full min-h-[380px] min-w-0 py-6.5 px-10">
      <div className="ds-chart-header">
        <div>
          <p className="text-[1.375rem] font-medium text-[var(--color-primary)]">{averageDistanceLabel}</p>
          <p className="text-[0.75rem] text-soft">Total des kilometres 4 dernieres semaines</p>
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
            <label className="text-xs font-medium text-soft">
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

      <div className="min-w-0 bg-white p-3">
        <div className="h-66 w-full min-w-0">
          <MeasuredChartContainer className="h-full w-full min-w-0">
            {({ width, height }) => (
              <BarChart
                key={`${selectedDistanceYear ?? "all"}-${distanceRangeLabel}`}
                width={width}
                height={height}
                data={distancePoints}
                margin={{ top: 10, right: 6, left: 6, bottom: 0 }}
                barCategoryGap={20}
              >
                <XAxis
                  dataKey="label"
                  axisLine={{ stroke: "#717171", strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fill: "#717171", fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis
                  axisLine={{ stroke: "#717171", strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fill: "#717171", fontSize: 11 }}
                  tickMargin={8}
                  allowDecimals={false}
                  domain={[0, distanceYAxisMax]}
                  ticks={distanceTicks}
                  width={24}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={<DistanceTooltip />}
                />
                <Bar
                  dataKey="value"
                  fill="var(--color-primary-soft)"
                  activeBar={{ fill: "var(--color-primary)" }}
                  radius={[999, 999, 0, 0]}
                  barSize={14}
                  animationDuration={500}
                />
              </BarChart>
            )}
          </MeasuredChartContainer>
        </div>

        <div className="ds-chart-legend">
          <span className="ds-legend-item">
            <span className="ds-legend-dot bg-[#7987FF]" />
            Km
          </span>
        </div>
      </div>

     
    </DashboardCard>
  );
}