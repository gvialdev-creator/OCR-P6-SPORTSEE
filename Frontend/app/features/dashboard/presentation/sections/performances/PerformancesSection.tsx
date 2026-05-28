import type { DistancePoint, HeartRatePoint } from "../../../model";
import { DistanceChartCard } from "./DistanceChartCard";
import { HeartRateChartCard } from "./HeartRateChartCard";
import { SectionHeader } from "../../components/SectionHeader";

type PerformancesSectionProps = {
  averageDistanceLabel: string;
  distancePoints: DistancePoint[];
  distanceRangeLabel: string;
  distanceRangeYearLabel: string;
  availableDistanceYears: number[];
  selectedDistanceYear: number | null;
  onSelectDistanceYear: (year: number) => void;
  canShowPreviousDistancePeriod: boolean;
  canShowNextDistancePeriod: boolean;
  onShowPreviousDistancePeriod: () => void;
  onShowNextDistancePeriod: () => void;
  averageBpmLabel: string;
  heartRatePoints: HeartRatePoint[];
  heartRangeLabel: string;
  heartRangeYearLabel: string;
  availableHeartYears: number[];
  selectedHeartYear: number | null;
  onSelectHeartYear: (year: number) => void;
  canShowPreviousHeartPeriod: boolean;
  canShowNextHeartPeriod: boolean;
  onShowPreviousHeartPeriod: () => void;
  onShowNextHeartPeriod: () => void;
};

export function PerformancesSection({
  averageDistanceLabel,
  distancePoints,
  distanceRangeLabel,
  distanceRangeYearLabel,
  availableDistanceYears,
  selectedDistanceYear,
  onSelectDistanceYear,
  canShowPreviousDistancePeriod,
  canShowNextDistancePeriod,
  onShowPreviousDistancePeriod,
  onShowNextDistancePeriod,
  averageBpmLabel,
  heartRatePoints,
  heartRangeLabel,
  heartRangeYearLabel,
  availableHeartYears,
  selectedHeartYear,
  onSelectHeartYear,
  canShowPreviousHeartPeriod,
  canShowNextHeartPeriod,
  onShowPreviousHeartPeriod,
  onShowNextHeartPeriod,
}: PerformancesSectionProps) {
  return (
    <section className="space-y-8">
      <SectionHeader
        title="Vos dernieres performances"
        titleClassName="text-[1.375rem] font-semibold text-primary"
      />
      <div className="app-grid-two">
        <DistanceChartCard
          averageDistanceLabel={averageDistanceLabel}
          distancePoints={distancePoints}
          distanceRangeLabel={distanceRangeLabel}
          distanceRangeYearLabel={distanceRangeYearLabel}
          availableDistanceYears={availableDistanceYears}
          selectedDistanceYear={selectedDistanceYear}
          onSelectDistanceYear={onSelectDistanceYear}
          canShowPreviousPeriod={canShowPreviousDistancePeriod}
          canShowNextPeriod={canShowNextDistancePeriod}
          onShowPreviousPeriod={onShowPreviousDistancePeriod}
          onShowNextPeriod={onShowNextDistancePeriod}
        />
        <HeartRateChartCard
          averageBpmLabel={averageBpmLabel}
          heartRatePoints={heartRatePoints}
          heartRangeLabel={heartRangeLabel}
          heartRangeYearLabel={heartRangeYearLabel}
          availableHeartYears={availableHeartYears}
          selectedHeartYear={selectedHeartYear}
          onSelectHeartYear={onSelectHeartYear}
          canShowPreviousPeriod={canShowPreviousHeartPeriod}
          canShowNextPeriod={canShowNextHeartPeriod}
          onShowPreviousPeriod={onShowPreviousHeartPeriod}
          onShowNextPeriod={onShowNextHeartPeriod}
        />
      </div>
    </section>
  );
}
