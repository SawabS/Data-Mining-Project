import { useState, useEffect } from "react";
import { useGetStackedBarData } from "@/lib/react-query/query/accident.query";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { MapPinned } from "lucide-react";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { SEVERITY_LABELS } from "@/lib/enums";
import { useChartTheme } from "@/hooks/useChartTheme";

// Theme-aware severity colors - must be computed at runtime
const useSeverityColors = () => {
  const [colors, setColors] = useState({
    severity1: "#4caf50",
    severity2: "#ffc107",
    severity3: "#ff9800",
    severity4: "#f44336",
  });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      setColors({
        severity1:
          computedStyle.getPropertyValue("--severity-1").trim() || "#4caf50",
        severity2:
          computedStyle.getPropertyValue("--severity-2").trim() || "#ffc107",
        severity3:
          computedStyle.getPropertyValue("--severity-3").trim() || "#ff9800",
        severity4:
          computedStyle.getPropertyValue("--severity-4").trim() || "#f44336",
      });
    };

    updateColors();
    // Watch for theme changes
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
};

// POI options for the dropdown
const POI_OPTIONS = [
  { value: "all", label: "All POIs" },
  { value: "junction", label: "Junction" },
  { value: "trafficSignal", label: "Traffic Signal" },
  { value: "stop", label: "Stop Sign" },
  { value: "crossing", label: "Crossing" },
  { value: "bump", label: "Speed Bump" },
  { value: "giveWay", label: "Give Way" },
  { value: "railway", label: "Railway" },
  { value: "station", label: "Station" },
  { value: "amenity", label: "Amenity" },
];

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (!active || !payload || !payload.length) return null;

  const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

  return (
    <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{SEVERITY_LABELS[entry.dataKey] || entry.dataKey}</span>
          </div>
          <span className="font-medium">
            {entry.value?.toLocaleString()} (
            {((entry.value / total) * 100).toFixed(1)}%)
          </span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t flex justify-between">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">{total.toLocaleString()}</span>
      </div>
    </div>
  );
};

export const POIStackedBarChart = () => {
  const { queries, setQueries } = useAppQueryParams();
  const [viewMode, setViewMode] = useState<"comparison" | "percentage">(
    "comparison"
  );
  const severityColors = useSeverityColors();
  const chartTheme = useChartTheme();

  const { data: stackedBarData, isLoading } = useGetStackedBarData(
    queries.poi && queries.poi !== "all" ? queries.poi : undefined
  );

  // Transform data for the chart
  const chartData =
    stackedBarData?.data.flatMap((category) => [
      {
        name: `${category.category} - Present`,
        category: category.category,
        presence: "Present",
        severity1: category.present.severity1,
        severity2: category.present.severity2,
        severity3: category.present.severity3,
        severity4: category.present.severity4,
        total: category.present.total,
      },
      {
        name: `${category.category} - Absent`,
        category: category.category,
        presence: "Absent",
        severity1: category.absent.severity1,
        severity2: category.absent.severity2,
        severity3: category.absent.severity3,
        severity4: category.absent.severity4,
        total: category.absent.total,
      },
    ]) || [];

  // Calculate percentage data
  const percentageData = chartData.map((item) => ({
    ...item,
    severity1: item.total > 0 ? (item.severity1 / item.total) * 100 : 0,
    severity2: item.total > 0 ? (item.severity2 / item.total) * 100 : 0,
    severity3: item.total > 0 ? (item.severity3 / item.total) * 100 : 0,
    severity4: item.total > 0 ? (item.severity4 / item.total) * 100 : 0,
  }));

  const displayData = viewMode === "percentage" ? percentageData : chartData;

  if (isLoading) {
    return (
      <ChartLoader
        title="Point of Interest Impact Analysis"
        description="Examining infrastructure influence on accident severity"
        icon={<MapPinned className="w-5 h-5 text-[var(--cta)]" />}
        height={450}
      />
    );
  }

  // Summary statistics
  // Calculate total accidents from the first category's present + absent counts
  // Since each category covers the entire dataset (present + absent = total),
  // we can just take the total from the first category to get the true total accidents.
  // Summing all categories would result in duplicates as accidents can have multiple POIs.
  const totalAccidents =
    stackedBarData?.data && stackedBarData.data.length > 0
      ? stackedBarData.data[0].present.total +
        stackedBarData.data[0].absent.total
      : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Point of Interest Impact Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Comparison of accident severity near different infrastructure
              elements
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={queries.poi || "all"}
              onValueChange={(value) =>
                setQueries((prev) => ({
                  ...prev,
                  poi: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select POI" />
              </SelectTrigger>
              <SelectContent>
                {POI_OPTIONS.map((poi) => (
                  <SelectItem key={poi.value} value={poi.value}>
                    {poi.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={viewMode}
              onValueChange={(v) =>
                setViewMode(v as "comparison" | "percentage")
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comparison">Absolute Count</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>
            Total Accidents:{" "}
            <strong className="text-foreground">
              {totalAccidents.toLocaleString()}
            </strong>
          </span>
          <span>
            POI Categories:{" "}
            <strong className="text-foreground">
              {stackedBarData?.data.length || 0}
            </strong>
          </span>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-4">
          {Object.entries(severityColors).map(([key, color]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{SEVERITY_LABELS[key]}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartTheme.gridColor}
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 11, fill: chartTheme.textColor }}
                interval={0}
                stroke={chartTheme.gridColor}
              />
              <YAxis
                tick={{ fontSize: 12, fill: chartTheme.textColor }}
                stroke={chartTheme.gridColor}
                tickFormatter={(value) =>
                  viewMode === "percentage"
                    ? `${value}%`
                    : value.toLocaleString()
                }
                domain={viewMode === "percentage" ? [0, 100] : undefined}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar
                dataKey="severity1"
                stackId="stack"
                fill={severityColors.severity1}
                name="Severity 1"
              />
              <Bar
                dataKey="severity2"
                stackId="stack"
                fill={severityColors.severity2}
                name="Severity 2"
              />
              <Bar
                dataKey="severity3"
                stackId="stack"
                fill={severityColors.severity3}
                name="Severity 3"
              />
              <Bar
                dataKey="severity4"
                stackId="stack"
                fill={severityColors.severity4}
                name="Severity 4"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        {stackedBarData?.data && stackedBarData.data.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Key Insights</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {stackedBarData.data.slice(0, 3).map((category) => {
                const presentTotal = category.present.total;
                const absentTotal = category.absent.total;
                const presentHighSeverity =
                  category.present.severity3 + category.present.severity4;
                const absentHighSeverity =
                  category.absent.severity3 + category.absent.severity4;
                const presentHighPct =
                  presentTotal > 0
                    ? ((presentHighSeverity / presentTotal) * 100).toFixed(1)
                    : "0";
                const absentHighPct =
                  absentTotal > 0
                    ? ((absentHighSeverity / absentTotal) * 100).toFixed(1)
                    : "0";

                return (
                  <li key={category.category}>
                    <strong>{category.category}:</strong> {presentHighPct}% high
                    severity when present vs {absentHighPct}% when absent
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-4">
          "Present" indicates accidents near the POI. "Absent" indicates
          accidents not near the POI. Bar segments show severity distribution.
        </p>
      </CardContent>
    </Card>
  );
};

export default POIStackedBarChart;
