import { memo, useMemo, useEffect, useState } from "react";
import {
  useGetFilterOptions,
  useGetTemporalHeatmap,
} from "@/lib/react-query/query/accident.query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartLoader } from "@/components/shared/ChartLoader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { Clock } from "lucide-react";
import { STATE_NAMES } from "@/lib/enums";

// Days of week in order
const DAYS_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Short day names for display
const DAYS_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

// Hours for display
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Theme-aware heatmap colors hook
const useHeatmapColors = () => {
  const [colors, setColors] = useState<string[]>([
    "#374151", // heat-0
    "#fef9c3", // heat-1
    "#fed7aa", // heat-2
    "#fb923c", // heat-3
    "#ef4444", // heat-4
    "#b91c1c", // heat-5
  ]);

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      setColors([
        computedStyle.getPropertyValue("--heat-0").trim() || "#374151",
        computedStyle.getPropertyValue("--heat-1").trim() || "#fef9c3",
        computedStyle.getPropertyValue("--heat-2").trim() || "#fed7aa",
        computedStyle.getPropertyValue("--heat-3").trim() || "#fb923c",
        computedStyle.getPropertyValue("--heat-4").trim() || "#ef4444",
        computedStyle.getPropertyValue("--heat-5").trim() || "#b91c1c",
      ]);
    };

    updateColors();
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
};

// Color scale function - interpolates from light to dark red
const getColorForValue = (
  value: number,
  maxValue: number,
  heatColors: string[]
): { bg: string; isLight: boolean } => {
  if (value === 0 || maxValue === 0) {
    return { bg: heatColors[0], isLight: false };
  }

  const intensity = value / maxValue;

  // Color scale based on intensity
  if (intensity < 0.2) {
    return { bg: heatColors[1], isLight: true };
  } else if (intensity < 0.4) {
    return { bg: heatColors[2], isLight: true };
  } else if (intensity < 0.6) {
    return { bg: heatColors[3], isLight: false };
  } else if (intensity < 0.8) {
    return { bg: heatColors[4], isLight: false };
  } else {
    return { bg: heatColors[5], isLight: false };
  }
};

// Format hour for display
const formatHour = (hour: number): string => {
  if (hour === 0) return "12AM";
  if (hour === 12) return "12PM";
  if (hour < 12) return `${hour}AM`;
  return `${hour - 12}PM`;
};

type HeatmapCellProps = {
  hour: number;
  day: string;
  count: number;
  maxCount: number;
  heatColors: string[];
};
const HeatmapCellComponent = ({
  hour,
  day,
  count,
  maxCount,
  heatColors,
}: HeatmapCellProps) => {
  const colors = getColorForValue(count, maxCount, heatColors);

  const cell = (
    <div
      className={cn(
        "w-full aspect-square rounded-sm flex items-center justify-center text-[10px] font-medium transition-all hover:scale-110 hover:z-10 cursor-pointer"
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.isLight ? "#1f2937" : "#ffffff",
      }}
    >
      {count > 0 ? count.toLocaleString() : ""}
    </div>
  );

  if (!count) return cell;

  return (
    <Tooltip delayDuration={80}>
      <TooltipTrigger asChild>{cell}</TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <div className="font-semibold">
          {day}, {formatHour(hour)}
        </div>
        <div className="text-muted-foreground">
          {count.toLocaleString()} accidents
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const HeatmapCell = memo(HeatmapCellComponent);
HeatmapCell.displayName = "HeatmapCell";

export const TemporalHeatmap = () => {
  const { queries, setQueries } = useAppQueryParams();
  const heatColors = useHeatmapColors();

  const stateValue = queries.state || "all";
  const cityValue = queries.city || "all";

  const filters = useMemo(
    () => ({
      state: queries.state || undefined,
      city: queries.city || undefined,
    }),
    [queries.city, queries.state]
  );

  const handleStateChange = (value: string) => {
    setQueries({ state: value === "all" ? "" : value });
  };

  const handleCityChange = (value: string) => {
    setQueries({ city: value === "all" ? "" : value });
  };

  const { data: filterOptions, isLoading: isLoadingFilters } =
    useGetFilterOptions();
  const { data: heatmapData, isLoading: isLoadingHeatmap } =
    useGetTemporalHeatmap(filters.city, filters.state);

  // Create a 2D matrix for the heatmap
  const heatmapMatrix = useMemo(() => {
    if (!heatmapData?.data) return null;

    const matrix: Record<string, Record<number, number>> = {};

    // Initialize matrix with zeros
    DAYS_ORDER.forEach((day) => {
      matrix[day] = {};
      HOURS.forEach((hour) => {
        matrix[day][hour] = 0;
      });
    });

    // Fill in the actual data
    heatmapData.data.forEach((cell) => {
      if (matrix[cell.dayOfWeek]) {
        matrix[cell.dayOfWeek][cell.hour] = cell.count;
      }
    });

    return matrix;
  }, [heatmapData]);

  const handleClearFilters = () => {
    setQueries({ city: "", state: "" });
  };

  if (isLoadingHeatmap || isLoadingFilters) {
    return (
      <ChartLoader
        title="Temporal Cyclicality Assessment"
        description="Analyzing accident patterns across hours and days of the week"
        icon={<Clock className="w-5 h-5 text-[var(--cta)]" />}
        height={450}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Temporal Cyclicality Assessment
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Distribution of accidents by hour of day and day of week
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={stateValue} onValueChange={handleStateChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {filterOptions?.states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {STATE_NAMES[state]
                      ? `${STATE_NAMES[state]} (${state})`
                      : state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cityValue} onValueChange={handleCityChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {filterOptions?.cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(queries.city || queries.state) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {heatmapData && (
          <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Total Accidents:{" "}
              <strong className="text-foreground">
                {heatmapData.totalAccidents.toLocaleString()}
              </strong>
            </span>
            <span>
              Peak:{" "}
              <strong className="text-foreground">
                {heatmapData.maxCount.toLocaleString()}
              </strong>{" "}
              in a single slot
            </span>
          </div>
        )}

        <TooltipProvider delayDuration={80}>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Hour labels */}
              <div className="flex mb-2">
                <div className="w-16 shrink-0" /> {/* Spacer for day labels */}
                <div className="flex-1 grid grid-cols-24 gap-1">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="text-[10px] text-center text-muted-foreground font-medium"
                    >
                      {hour % 3 === 0 ? formatHour(hour) : ""}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap grid */}
              <div className="space-y-1">
                {DAYS_ORDER.map((day) => (
                  <div key={day} className="flex items-center gap-2">
                    <div className="w-14 shrink-0 text-xs font-medium text-muted-foreground text-right pr-2">
                      {DAYS_SHORT[day]}
                    </div>
                    <div className="flex-1 grid grid-cols-24 gap-1">
                      {HOURS.map((hour) => (
                        <HeatmapCell
                          key={`${day}-${hour}`}
                          hour={hour}
                          day={day}
                          count={heatmapMatrix?.[day]?.[hour] ?? 0}
                          maxCount={heatmapData?.maxCount ?? 0}
                          heatColors={heatColors}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <span className="text-xs text-muted-foreground">Low</span>
                <div className="flex gap-1">
                  {heatColors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-4 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">High</span>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default TemporalHeatmap;
