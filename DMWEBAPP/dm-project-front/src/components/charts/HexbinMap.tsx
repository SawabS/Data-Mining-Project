import { useState, useMemo, useEffect, useRef } from "react";
import {
  useGetHexbinMapData,
  useGetFilterOptions,
} from "@/lib/react-query/query/accident.query";
import { STATE_NAMES } from "@/lib/enums";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartLoader } from "@/components/shared/ChartLoader";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Loader2, MapPin } from "lucide-react";
import * as d3 from "d3";
import { hexbin as d3Hexbin } from "d3-hexbin";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

// US TopoJSON URL
const US_TOPO_JSON_URL =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Theme-aware hexbin colors hook
const useHexbinColors = () => {
  const [colors, setColors] = useState({
    low: "#98c379",
    medLow: "#e5c07b",
    med: "#d19a66",
    high: "#e06c75",
    veryHigh: "#be5046",
  });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      setColors({
        low: computedStyle.getPropertyValue("--hexbin-low").trim() || "#98c379",
        medLow:
          computedStyle.getPropertyValue("--hexbin-med-low").trim() ||
          "#e5c07b",
        med: computedStyle.getPropertyValue("--hexbin-med").trim() || "#d19a66",
        high:
          computedStyle.getPropertyValue("--hexbin-high").trim() || "#e06c75",
        veryHigh:
          computedStyle.getPropertyValue("--hexbin-very-high").trim() ||
          "#be5046",
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

// SVG dimensions
const WIDTH = 960;
const HEIGHT = 600;
const HEX_RADIUS = 4; // Reduced radius for higher resolution

export const HexbinMap = () => {
  const { queries, setQueries } = useAppQueryParams();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [usGeoData, setUsGeoData] = useState<d3.GeoPermissibleObjects | null>(
    null
  );
  const [hoveredHex, setHoveredHex] = useState<{
    x: number;
    y: number;
    count: number;
  } | null>(null);
  const hexColors = useHexbinColors();
  const svgRef = useRef<SVGSVGElement>(null);

  const { data: filterOptions, isLoading: isLoadingFilters } =
    useGetFilterOptions();
  const {
    data: hexbinData,
    isLoading: isLoadingHexbin,
    isFetching,
  } = useGetHexbinMapData(queries.state || undefined);

  // Load US TopoJSON data
  useEffect(() => {
    const loadUsMap = async () => {
      try {
        const response = await fetch(US_TOPO_JSON_URL);
        const us = (await response.json()) as Topology<{
          states: GeometryCollection;
          nation: GeometryCollection;
        }>;
        const states = topojson.feature(us, us.objects.states);
        setUsGeoData(states);
      } catch (error) {
        console.error("Failed to load US map:", error);
      }
    };
    loadUsMap();
  }, []);

  // Create projection - geoAlbersUsa is specifically designed for US maps
  const projection = useMemo(() => {
    return d3
      .geoAlbersUsa()
      .scale(1200)
      .translate([WIDTH / 2, HEIGHT / 2]);
  }, []);

  // Create path generator for the US map
  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Create hexbin generator
  const hexbinGenerator = useMemo(() => {
    return d3Hexbin<[number, number, number]>()
      .extent([
        [0, 0],
        [WIDTH, HEIGHT],
      ])
      .radius(HEX_RADIUS)
      .x((d) => d[0])
      .y((d) => d[1]);
  }, []);

  // Project points and create hexbins
  const { bins, radiusScale } = useMemo(() => {
    if (!hexbinData?.points || hexbinData.points.length === 0) {
      return { bins: [], radiusScale: () => HEX_RADIUS };
    }

    // Convert lat/lng to screen coordinates using projection
    const projectedPoints: [number, number, number][] = [];

    hexbinData.points.forEach((point) => {
      // Ensure numbers
      const lng = Number(point.lng);
      const lat = Number(point.lat);
      const count = Number(point.count);

      if (!isNaN(lng) && !isNaN(lat)) {
        const coords = projection([lng, lat]);
        if (coords) {
          // We attach the count to the point: [x, y, count]
          projectedPoints.push([coords[0], coords[1], count]);
        }
      }
    });

    // Create hexbins
    const generatedBins = hexbinGenerator(projectedPoints);

    // Sum up the counts for each bin
    const binsWithCounts = generatedBins.map((bin) => {
      const totalCount = bin.reduce((sum, p) => sum + (p[2] || 0), 0);
      // We attach the total count to the bin array for easy access
      return Object.assign(bin, { totalCount });
    });

    // Create radius scale based on count
    // Use a log scale for radius to handle the large dynamic range (1 to 100k+)
    // This ensures low-count bins are still visible
    const maxCount = d3.max(binsWithCounts, (d) => d.totalCount) || 1;
    const minCount = d3.min(binsWithCounts, (d) => d.totalCount) || 1;

    const radiusScale = d3
      .scaleLog()
      .domain([minCount, maxCount])
      .range([1.5, HEX_RADIUS]); // Minimum radius 1.5px ensures visibility

    console.log(
      "Hexbins generated:",
      binsWithCounts.length,
      "Max count:",
      maxCount
    );

    return { bins: binsWithCounts, radiusScale };
  }, [hexbinData?.points, projection, hexbinGenerator]);

  // Color scale based on hexbin density
  const colorScale = useMemo(() => {
    if (bins.length === 0) return () => hexColors.low;

    const maxCount = d3.max(bins, (d: any) => d.totalCount) || 1;
    const minCount = d3.min(bins, (d: any) => d.totalCount) || 1;

    // Use log scale for color as well to show gradients better
    return d3
      .scaleSequentialLog(d3.interpolateSpectral)
      .domain([maxCount, minCount]); // Invert domain: Red (High) -> Blue (Low)
  }, [bins, hexColors]);

  // Mouse event handlers for pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.3, 5));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.3, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  if (isLoadingHexbin || isLoadingFilters) {
    return (
      <ChartLoader
        title="Geospatial Hotspot Analysis"
        description="Mapping accident density across geographic regions"
        icon={<MapPin className="w-5 h-5 text-[var(--cta)]" />}
        height={500}
      />
    );
  }

  return (
    <Card className="w-full bg-[var(--card_full_white)] border-[var(--border-color)] animate-in fade-in duration-300">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--cta)]/10">
              <MapPin className="w-5 h-5 text-[var(--cta)]" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-[var(--on-white-text)]">
                Geospatial Hotspot Analysis
              </CardTitle>
              <p className="text-sm text-[var(--muted)] mt-1">
                Hexagonal binning map showing accident density clusters across
                the US
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* State Filter */}
            <Select
              value={queries.state || "all"}
              onValueChange={(value) =>
                setQueries({ ...queries, state: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="w-[160px] bg-[var(--background)] border-[var(--border-color)] text-[var(--text)]">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--card_full_white)] border-[var(--border-color)]">
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

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border border-[var(--border-color)] rounded-lg bg-[var(--background)] overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                className="h-9 w-9 rounded-none hover:bg-[var(--cta)]/10"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="px-2 text-sm text-[var(--muted)] min-w-[50px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                className="h-9 w-9 rounded-none hover:bg-[var(--cta)]/10"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="h-9 w-9 rounded-none border-l border-[var(--border-color)] hover:bg-[var(--cta)]/10"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Row */}
        {hexbinData && (
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--cta)]/10 text-[var(--cta)]">
              <span className="font-medium">
                {hexbinData.totalAccidents.toLocaleString()}
              </span>
              <span className="text-[var(--muted)]">accidents</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary_girl)]/10 text-[var(--primary_girl)]">
              <span className="font-medium">
                {hexbinData.points.length.toLocaleString()}
              </span>
              <span className="text-[var(--muted)]">grid cells</span>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div
          className={`
            relative border border-[var(--border-color)] rounded-xl overflow-hidden 
            bg-[var(--background)] transition-opacity duration-300
            ${isFetching ? "opacity-60" : "opacity-100"}
          `}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {/* Loading overlay */}
          {isFetching && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]/50 z-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card_full_white)] border border-[var(--border-color)] shadow-lg">
                <Loader2 className="w-4 h-4 text-[var(--cta)] animate-spin" />
                <span className="text-sm text-[var(--text)]">
                  Loading data...
                </span>
              </div>
            </div>
          )}

          {/* Tooltip */}
          {hoveredHex && (
            <div
              className="absolute pointer-events-none z-20 px-3 py-2 rounded-lg bg-[var(--card_full_white)] border border-[var(--border-color)] shadow-lg"
              style={{
                left: hoveredHex.x * zoom + pan.x + 20,
                top: hoveredHex.y * zoom + pan.y - 10,
              }}
            >
              <div className="text-sm font-semibold text-[var(--on-white-text)]">
                {hoveredHex.count.toLocaleString()} accidents
              </div>
            </div>
          )}

          <svg
            ref={svgRef}
            width="100%"
            height={HEIGHT}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              handleMouseUp();
              setHoveredHex(null);
            }}
            className="select-none"
          >
            <defs>
              <filter
                id="hexShadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feDropShadow
                  dx="0"
                  dy="1"
                  stdDeviation="1"
                  floodOpacity="0.2"
                />
              </filter>
            </defs>

            <g
              transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
              style={{ transformOrigin: "center center" }}
            >
              {/* US Map Background */}
              {usGeoData && (
                <g className="us-map">
                  {(usGeoData as GeoJSON.FeatureCollection).features?.map(
                    (feature, i: number) => (
                      <path
                        key={i}
                        d={
                          pathGenerator(feature as d3.GeoPermissibleObjects) ||
                          ""
                        }
                        fill="var(--muted)"
                        fillOpacity={0.1}
                        stroke="var(--border-color)"
                        strokeWidth={0.5}
                        strokeOpacity={0.5}
                      />
                    )
                  )}
                </g>
              )}

              {/* Hexbins */}
              <g className="hexbins">
                {bins.map((bin: any, i: number) => (
                  <path
                    key={`${bin.x}-${bin.y}-${i}`}
                    d={hexbinGenerator.hexagon(radiusScale(bin.totalCount))}
                    transform={`translate(${bin.x},${bin.y})`}
                    fill={colorScale(bin.totalCount)}
                    fillOpacity={0.8}
                    stroke="none"
                    style={{
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={() =>
                      setHoveredHex({
                        x: bin.x,
                        y: bin.y,
                        count: bin.totalCount,
                      })
                    }
                    onMouseLeave={() => setHoveredHex(null)}
                  />
                ))}
              </g>
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-xs text-[var(--muted)]">Low Density</span>
          <div
            className="flex gap-0.5 h-4 w-48 rounded-sm overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${d3.interpolateSpectral(
                1
              )}, ${d3.interpolateSpectral(0)})`,
            }}
          />
          <span className="text-xs text-[var(--muted)]">High Density</span>
        </div>

        <p className="text-xs text-[var(--muted)] text-center mt-3">
          Drag to pan, use buttons to zoom. Hexagon size and color indicate
          accident density.
        </p>
      </CardContent>
    </Card>
  );
};

export default HexbinMap;
