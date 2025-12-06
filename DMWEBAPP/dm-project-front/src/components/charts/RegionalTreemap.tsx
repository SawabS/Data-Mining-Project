import { useState, useMemo, useCallback, useEffect } from "react";
import {
  useGetTreemapData,
  useGetFilterOptions,
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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TreemapNode } from "@/lib/react-query/actions/accident.action";
import { ChevronLeft, BarChart3 } from "lucide-react";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { SEVERITY_LABELS, STATE_NAMES } from "@/lib/enums";

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

// Severity color scale function - takes colors as parameter
const getSeverityColor = (
  severity: number,
  colors: Record<number, string>
): string => {
  const rounded = Math.round(severity);
  const clamped = Math.max(1, Math.min(4, rounded));
  return colors[clamped];
};

// Simple treemap layout algorithm (squarified)
type LayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  node: TreemapNode;
};

// Recursive squarified treemap layout
const squarify = (
  nodes: TreemapNode[],
  x: number,
  y: number,
  width: number,
  height: number,
  minSize: number = 20
): LayoutRect[] => {
  if (!nodes.length || width < minSize || height < minSize) return [];

  const totalValue = nodes.reduce((sum, n) => sum + n.value, 0);
  if (totalValue === 0) return [];

  const sortedNodes = [...nodes].sort((a, b) => b.value - a.value);
  const result: LayoutRect[] = [];

  let currentX = x;
  let currentY = y;
  let remainingWidth = width;
  let remainingHeight = height;
  let remainingValue = totalValue;

  for (const node of sortedNodes) {
    const ratio = node.value / remainingValue;
    const isHorizontal = remainingWidth >= remainingHeight;

    let rectWidth: number;
    let rectHeight: number;

    if (isHorizontal) {
      rectWidth = Math.max(remainingWidth * ratio, minSize);
      rectHeight = remainingHeight;
      result.push({
        x: currentX,
        y: currentY,
        width: rectWidth,
        height: rectHeight,
        node,
      });
      currentX += rectWidth;
      remainingWidth -= rectWidth;
    } else {
      rectWidth = remainingWidth;
      rectHeight = Math.max(remainingHeight * ratio, minSize);
      result.push({
        x: currentX,
        y: currentY,
        width: rectWidth,
        height: rectHeight,
        node,
      });
      currentY += rectHeight;
      remainingHeight -= rectHeight;
    }

    remainingValue -= node.value;
  }

  return result;
};

// Treemap cell component
const TreemapCell = ({
  rect,
  onDrillDown,
  severityColors,
}: {
  rect: LayoutRect;
  onDrillDown: (node: TreemapNode) => void;
  severityColors: Record<number, string>;
}) => {
  const { x, y, width, height, node } = rect;
  const hasChildren = node.children && node.children.length > 0;
  const showLabel = width > 50 && height > 25;
  const showValue = width > 70 && height > 40;

  const color = getSeverityColor(node.avgSeverity, severityColors);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <g
            className={hasChildren ? "cursor-pointer" : "cursor-default"}
            onClick={() => hasChildren && onDrillDown(node)}
          >
            <rect
              x={x}
              y={y}
              width={Math.max(width - 2, 1)}
              height={Math.max(height - 2, 1)}
              fill={color}
              stroke="#fff"
              strokeWidth={1}
              rx={2}
              className="transition-all hover:opacity-80"
            />
            {showLabel && (
              <>
                <text
                  x={x + width / 2}
                  y={y + height / 2 - (showValue ? 6 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] font-medium fill-white pointer-events-none"
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  {node.name.length > 15
                    ? node.name.substring(0, 12) + "..."
                    : node.name}
                </text>
                {showValue && (
                  <text
                    x={x + width / 2}
                    y={y + height / 2 + 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[9px] fill-white/80 pointer-events-none"
                    style={{
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                  >
                    {node.value.toLocaleString()}
                  </text>
                )}
              </>
            )}
          </g>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <div className="font-semibold">{node.name}</div>
          <div className="text-muted-foreground">
            Accidents: {node.value.toLocaleString()}
          </div>
          <div className="text-muted-foreground">
            Avg Severity: {node.avgSeverity.toFixed(2)}
          </div>
          {hasChildren && (
            <div className="text-primary mt-1">Click to drill down →</div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const RegionalTreemap = () => {
  const { queries, setQueries } = useAppQueryParams();
  const [drillPath, setDrillPath] = useState<TreemapNode[]>([]);
  const severityColors = useSeverityColors();

  const { data: filterOptions, isLoading: isLoadingFilters } =
    useGetFilterOptions();
  const { data: treemapData, isLoading: isLoadingTreemap } = useGetTreemapData(
    queries.state || undefined
  );

  // SVG dimensions
  const width = 900;
  const height = 500;
  const padding = 10;

  // Current view data
  const currentNode = useMemo(() => {
    if (drillPath.length === 0) return treemapData?.data;
    return drillPath[drillPath.length - 1];
  }, [treemapData?.data, drillPath]);

  // Calculate layout
  const layout = useMemo(() => {
    if (!currentNode?.children) return [];

    return squarify(
      currentNode.children,
      padding,
      padding,
      width - padding * 2,
      height - padding * 2,
      15
    );
  }, [currentNode]);

  // Navigation handlers
  const handleDrillDown = useCallback((node: TreemapNode) => {
    if (node.children && node.children.length > 0) {
      setDrillPath((prev) => [...prev, node]);
    }
  }, []);

  const handleDrillUp = useCallback(() => {
    setDrillPath((prev) => prev.slice(0, -1));
  }, []);

  const handleStateChange = (value: string) => {
    setQueries((prev) => ({ ...prev, state: value === "all" ? "" : value }));
    setDrillPath([]);
  };

  // Breadcrumb path
  const breadcrumbPath = useMemo(() => {
    const path = ["USA"];
    drillPath.forEach((node) => path.push(node.name));
    return path;
  }, [drillPath]);

  if (isLoadingTreemap || isLoadingFilters) {
    return (
      <ChartLoader
        title="Hierarchical Regional Decomposition"
        description="Exploring accident distribution across states, counties, and cities"
        icon={<BarChart3 className="w-5 h-5 text-[var(--cta)]" />}
        height={500}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Hierarchical Regional Decomposition
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Treemap showing accident distribution by State → County → City
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={queries.state || "all"}
              onValueChange={handleStateChange}
            >
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Breadcrumb navigation */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          {drillPath.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDrillUp}
              className="mr-2"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          {breadcrumbPath.map((name, index) => (
            <span key={index} className="flex items-center text-sm">
              {index > 0 && (
                <span className="mx-2 text-muted-foreground">/</span>
              )}
              <span
                className={
                  index === breadcrumbPath.length - 1
                    ? "font-semibold"
                    : "text-muted-foreground cursor-pointer hover:text-foreground"
                }
                onClick={() => {
                  if (index < breadcrumbPath.length - 1) {
                    setDrillPath((prev) => prev.slice(0, index));
                  }
                }}
              >
                {name}
              </span>
            </span>
          ))}
        </div>

        {/* Stats */}
        {currentNode && (
          <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Total:{" "}
              <strong className="text-foreground">
                {currentNode.value.toLocaleString()}
              </strong>{" "}
              accidents
            </span>
            <span>
              Regions:{" "}
              <strong className="text-foreground">
                {currentNode.children?.length || 0}
              </strong>
            </span>
            {currentNode.avgSeverity > 0 && (
              <span>
                Avg Severity:{" "}
                <strong
                  style={{
                    color: getSeverityColor(
                      currentNode.avgSeverity,
                      severityColors
                    ),
                  }}
                >
                  {currentNode.avgSeverity.toFixed(2)}
                </strong>
              </span>
            )}
          </div>
        )}

        {/* Treemap */}
        <div className="border rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            {layout.map((rect, i) => (
              <TreemapCell
                key={`${rect.node.name}-${i}`}
                rect={rect}
                onDrillDown={handleDrillDown}
                severityColors={severityColors}
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
          {Object.entries(severityColors).map(([level, color]) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-muted-foreground">
                {SEVERITY_LABELS[parseInt(level)]}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Size represents accident count. Color represents average severity.
          Click on regions to drill down.
        </p>
      </CardContent>
    </Card>
  );
};

export default RegionalTreemap;
