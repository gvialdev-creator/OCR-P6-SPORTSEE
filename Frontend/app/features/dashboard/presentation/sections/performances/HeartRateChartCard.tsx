// Importation des bibliothèques nécessaires
import { useEffect, useRef, useState } from "react";
import type { HeartRatePoint } from "../../../model";
import { Bar, ComposedChart, Line, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardCard } from "../../components/DashboardCard";
import { MeasuredChartContainer } from "../../components/MeasuredChartContainer";

// Définition des types pour les props du composant HeartRateChartCard
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

// Définition du composant HeartRateChartCard
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
  // État pour suivre le survol de la ligne moyenne
  const [isAvgLineHovered, setIsAvgLineHovered] = useState(false);
  
  // État et référence pour gérer l'opacité de la ligne sombre
  const [darkLineOpacity, setDarkLineOpacity] = useState(0);
  const darkLineOpacityRef = useRef(0);

  // Effet secondaire pour animer l'opacité de la ligne moyenne
  useEffect(() => {
    const from = darkLineOpacityRef.current;
    const to = isAvgLineHovered ? 1 : 0;

    if (Math.abs(to - from) < 0.001) {
      return;
    }

    const durationMs = 320;
    const startTime = performance.now();
    let frameId = 0;

    // Fonction d'animation
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / durationMs, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const next = from + (to - from) * eased;
      darkLineOpacityRef.current = next;
      setDarkLineOpacity(next);

      if (t < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    // Nettoyage de l'animation
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isAvgLineHovered]);

  // Mise en forme des données pour le graphique
  const chartData = heartRatePoints.map((point) => ({
    label: point.label,
    min: point.min,
    max: point.max,
    avg: point.avg,
  }));

  // Rendu du composant
  return (
    <DashboardCard className="app-surface-card h-full min-h-[380px] min-w-0 py-6.5 px-10">
      <div className="ds-chart-header">
        <div>
          <p className="text-[1.375rem] font-medium text-[var(--color-secondary)]">{averageBpmLabel}</p>
          <p className="text-[0.75rem] text-soft">Frequence cardiaque moyenne</p>
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
            <label className="text-xs font-medium text-soft">
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

      <div className="min-w-0 bg-white p-3">
        <div className="h-66 w-full min-w-0">
          <MeasuredChartContainer className="h-full w-full min-w-0">
            {({ width, height }) => (
              <ComposedChart
                width={width}
                height={height}
                data={chartData}
                margin={{ top: 10, right: 6, left: 6, bottom: 0 }}
                barGap={4}
                onMouseMove={(state) => setIsAvgLineHovered(Boolean(state?.isTooltipActive))}
                onMouseLeave={() => setIsAvgLineHovered(false)}
              >
                <XAxis
                  dataKey="label"
                  axisLine={{ stroke: "#717171", strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fill: "#717171", fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis
                  type="number"
                  axisLine={{ stroke: "#717171", strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fill: "#717171", fontSize: 11 }}
                  tickMargin={8}
                  domain={([dataMin, dataMax]) => [
                    Math.max(0, Math.floor(dataMin - 15)),
                    Math.ceil(dataMax + 5),
                  ]}
                  tickCount={4}
                  width={24}
                />
                <Tooltip
                  cursor={false}
                  content={() => null}
                />
                <Bar dataKey="min" fill="var(--color-secondary-soft)" radius={[30, 30, 30, 30]} barSize={14} />
                <Bar dataKey="max" fill="var(--color-secondary)" radius={[30, 30, 30, 30]} barSize={14} />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#F2F3FF"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--color-primary)", stroke: "#F2F3FF", strokeWidth: 1 }}
                  activeDot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  opacity={darkLineOpacity}
                  isAnimationActive={false}
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--color-primary)", stroke: "#F2F3FF", strokeWidth: 1 }}
                />
              </ComposedChart>
            )}
          </MeasuredChartContainer>
        </div>

        <div className="ds-chart-legend">
          <span className="ds-legend-item">
            <span className="ds-legend-dot bg-[var(--color-secondary-soft)]" />
            Min
          </span>
          <span className="ds-legend-item">
            <span className="ds-legend-dot bg-[var(--color-secondary)]" />
            Max BPM
          </span>
          <span className="ds-legend-item">
            <span className="ds-legend-dot bg-[var(--color-primary)]" />
            Avg BPM
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}