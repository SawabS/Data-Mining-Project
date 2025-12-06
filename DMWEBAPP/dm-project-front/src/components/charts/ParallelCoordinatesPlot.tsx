import { useState, useMemo, useCallback, useEffect } from "react";
import { useGetParallelCoordinatesData } from "@/lib/react-query/query/accident.query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartLoader } from "@/components/shared/ChartLoader";
import { Slider } from "@/components/ui/slider";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { SEVERITY_LABELS } from "@/lib/enums";
import { CloudSun } from "lucide-react";

// Theme-aware severity colors hook
const useSeverityColors = () => {
  const [colors, setColors] = useState<Record<number, string>>({
    1: "#4caf50",
    2: "#ffc107",
    3: "#ff9800",
    4: "#f44336",
  });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      setColors({
        1: computedStyle.getPropertyValue("--severity-1").trim() || "#4caf50",
        2: computedStyle.getPropertyValue("--severity-2").trim() || "#ffc107",
        3: computedStyle.getPropertyValue("--severity-3").trim() || "#ff9800",
        4: computedStyle.getPropertyValue("--severity-4").trim() || "#f44336",
      });
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

// Axes configuration
const AXES = [
  { key: "temperature", label: "Temperature (°F)", unit: "°F" },
  { key: "humidity", label: "Humidity (%)", unit: "%" },
  { key: "pressure", label: "Pressure (in)", unit: "in" },
  { key: "visibility", label: "Visibility (mi)", unit: "mi" },
  { key: "windSpeed", label: "Wind Speed (mph)", unit: "mph" },
] as const;

type AxisKey = (typeof AXES)[number]["key"];

type BrushRange = {
  axis: AxisKey;
  min: number;
  max: number;
};

export const ParallelCoordinatesPlot = () => {
  const { queries, setQueries } = useAppQueryParams();
  const [brushRanges, setBrushRanges] = useState<BrushRange[]>([]);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const severityColors = useSeverityColors();

  const { data: pcpData, isLoading } = useGetParallelCoordinatesData(
    queries.severity ? parseInt(queries.severity) : undefined,
    queries.date_limit ? parseInt(queries.date_limit) : undefined
  );

  // SVG dimensions
  const width = 900;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Calculate axis positions
  const axisSpacing = plotWidth / (AXES.length - 1);

  // Scale functions
  const getScale = useCallback(
    (axis: AxisKey) => {
      if (!pcpData?.ranges) return { min: 0, max: 100 };
      const range = pcpData.ranges[axis];
      return { min: range.min, max: range.max };
    },
    [pcpData?.ranges]
  );

  // Convert value to Y position
  const valueToY = useCallback(
    (value: number, axis: AxisKey) => {
      const { min, max } = getScale(axis);
      const range = max - min || 1;
      const normalized = (value - min) / range;
      return padding.top + plotHeight * (1 - normalized); // Invert Y
    },
    [getScale, plotHeight]
  );

  // Generate path for a data point
  const generatePath = useCallback(
    (point: {
      temperature: number;
      humidity: number;
      pressure: number;
      visibility: number;
      windSpeed: number;
    }) => {
      const points = AXES.map((axis, i) => {
        const x = padding.left + i * axisSpacing;
        const y = valueToY(point[axis.key], axis.key);
        return `${x},${y}`;
      });
      return `M${points.join("L")}`;
    },
    [axisSpacing, valueToY]
  );

  // Filter data based on brush ranges
  const filteredData = useMemo(() => {
    if (!pcpData?.data) return [];

    return pcpData.data.filter((point) => {
      return brushRanges.every((brush) => {
        const value = point[brush.axis];
        return value >= brush.min && value <= brush.max;
      });
    });
  }, [pcpData?.data, brushRanges]);

  // Handle brush on axis
  const handleBrush = (axis: AxisKey, range: [number, number]) => {
    const { min, max } = getScale(axis);
    const actualMin = min + (range[0] / 100) * (max - min);
    const actualMax = min + (range[1] / 100) * (max - min);

    setBrushRanges((prev) => {
      const existing = prev.findIndex((b) => b.axis === axis);
      if (range[0] === 0 && range[1] === 100) {
        // Remove brush if full range
        return prev.filter((b) => b.axis !== axis);
      }
      const newBrush: BrushRange = { axis, min: actualMin, max: actualMax };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newBrush;
        return updated;
      }
      return [...prev, newBrush];
    });
  };

  const clearBrushes = () => setBrushRanges([]);

  if (isLoading) {
    return (
      <ChartLoader
        title="Multivariate Weather Correlation"
        description="Analyzing relationships between weather conditions and accidents"
        icon={<CloudSun className="w-5 h-5 text-[var(--cta)]" />}
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
              Multivariate Weather Correlation
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Parallel coordinates plot showing weather conditions vs severity
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={queries.severity}
              onValueChange={(value) =>
                setQueries({ ...queries, severity: value })
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                {[1, 2, 3, 4].map((sev) => (
                  <SelectItem key={sev} value={sev.toString()}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: severityColors[sev] }}
                      />
                      {SEVERITY_LABELS[sev]}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Display:</span>
              <Select
                value={queries.date_limit}
                onValueChange={(value) =>
                  setQueries({ ...queries, date_limit: value })
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1,000</SelectItem>
                  <SelectItem value="2000">2,000</SelectItem>
                  <SelectItem value="5000">5,000</SelectItem>
                  <SelectItem value="10000">10,000</SelectItem>
                  <SelectItem value="20000">20,000</SelectItem>
                  <SelectItem value="50000">50,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {brushRanges.length > 0 && (
              <button
                onClick={clearBrushes}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {pcpData && (
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              Showing:{" "}
              <strong className="text-foreground">
                {pcpData.data.length.toLocaleString()}
              </strong>
            </span>
            <span>•</span>
            <span>
              Total Available:{" "}
              <strong className="text-foreground">
                {pcpData.totalCount?.toLocaleString() || "N/A"}
              </strong>
            </span>
            {pcpData.totalCount && pcpData.data.length < pcpData.totalCount && (
              <>
                <span>•</span>
                <span className="text-[var(--warning)]">
                  Displaying{" "}
                  {((pcpData.data.length / pcpData.totalCount) * 100).toFixed(
                    1
                  )}
                  % of data
                </span>
              </>
            )}
            <span>•</span>
            <span>
              Filtered:{" "}
              <strong className="text-foreground">
                {filteredData.length.toLocaleString()}
              </strong>
            </span>
            <div className="flex items-center gap-3 ml-auto">
              {Object.entries(severityColors).map(([sev, color]) => (
                <div key={sev} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs">
                    {SEVERITY_LABELS[parseInt(sev)]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <svg width={width} height={height} className="mx-auto">
            {/* Lines (draw filtered ones with lower opacity first, then non-filtered) */}
            <g>
              {pcpData?.data.map((point, i) => {
                const isFiltered =
                  brushRanges.length > 0 && !filteredData.includes(point);
                const isHovered = hoveredLine === i;

                return (
                  <path
                    key={i}
                    d={generatePath(point)}
                    fill="none"
                    stroke={severityColors[point.severity]}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={isFiltered ? 0.05 : isHovered ? 1 : 0.3}
                    className="transition-opacity"
                    onMouseEnter={() => setHoveredLine(i)}
                    onMouseLeave={() => setHoveredLine(null)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </g>

            {/* Axes */}
            {AXES.map((axis, i) => {
              const x = padding.left + i * axisSpacing;
              const { min, max } = getScale(axis.key);

              return (
                <g key={axis.key}>
                  {/* Axis line */}
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + plotHeight}
                    stroke="currentColor"
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />

                  {/* Axis label */}
                  <text
                    x={x}
                    y={padding.top - 15}
                    textAnchor="middle"
                    className="text-xs fill-current font-medium"
                  >
                    {axis.label}
                  </text>

                  {/* Min/Max labels */}
                  <text
                    x={x}
                    y={padding.top + plotHeight + 15}
                    textAnchor="middle"
                    className="text-[10px] fill-current text-muted-foreground"
                  >
                    {min.toFixed(1)}
                  </text>
                  <text
                    x={x}
                    y={padding.top - 3}
                    textAnchor="middle"
                    className="text-[10px] fill-current text-muted-foreground"
                  >
                    {max.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Brush controls */}
        <div className="mt-6 space-y-4">
          <p className="text-sm font-medium text-center">
            Brush axes to filter data ranges:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {AXES.map((axis) => {
              const { min, max } = getScale(axis.key);
              const brush = brushRanges.find((b) => b.axis === axis.key);
              const currentRange = brush
                ? [
                    ((brush.min - min) / (max - min)) * 100,
                    ((brush.max - min) / (max - min)) * 100,
                  ]
                : [0, 100];

              return (
                <div key={axis.key} className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    {axis.label}
                  </label>
                  <Slider
                    value={currentRange as [number, number]}
                    onValueChange={(value) =>
                      handleBrush(axis.key, value as [number, number])
                    }
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{brush ? brush.min.toFixed(1) : min.toFixed(1)}</span>
                    <span>{brush ? brush.max.toFixed(1) : max.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hovered point info */}
        {hoveredLine !== null && pcpData?.data[hoveredLine] && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {AXES.map((axis) => (
                <div key={axis.key}>
                  <span className="text-muted-foreground">{axis.label}: </span>
                  <strong>
                    {pcpData.data[hoveredLine][axis.key].toFixed(1)} {axis.unit}
                  </strong>
                </div>
              ))}
              <div>
                <span className="text-muted-foreground">Severity: </span>
                <strong
                  style={{
                    color: severityColors[pcpData.data[hoveredLine].severity],
                  }}
                >
                  {SEVERITY_LABELS[pcpData.data[hoveredLine].severity]}
                </strong>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParallelCoordinatesPlot;
