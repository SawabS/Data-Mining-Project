import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetAccidents } from "@/lib/react-query/query/accident.query";
import { QUERY_KEYs } from "@/lib/react-query/keys";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { Accident } from "@/types/types";
import { getSeverityColor, SEVERITY_LABELS } from "@/lib/enums";
import {
  Loader2,
  Eye,
  MapPin,
  Calendar,
  AlertTriangle,
  Wind,
  Thermometer,
} from "lucide-react";
import { format } from "date-fns";
import NoData from "@/components/ui/NoData";

export const AccidentsTable = () => {
  const { queries } = useAppQueryParams();
  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(
    null
  );
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(false);

  // Construct query key similar to DataBox
  const queryKey = useMemo(
    () => [QUERY_KEYs.ACCIDENTS, { ...queries }] as [string, any],
    [queries]
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAccidents(queryKey);

  // Auto-load functionality - loads data progressively in background
  useEffect(() => {
    if (autoLoadEnabled && hasNextPage && !isFetchingNextPage) {
      const timer = setTimeout(() => {
        fetchNextPage();
      }, 500); // Load next chunk every 500ms
      return () => clearTimeout(timer);
    }
  }, [autoLoadEnabled, hasNextPage, isFetchingNextPage, fetchNextPage, data]);

  const accidents = useMemo(() => {
    if (!data?.pages || !Array.isArray(data.pages)) return [];
    const items = data.pages
      .filter((page: any) => page && Array.isArray(page.data))
      .flatMap((page: any) => page.data);

    // Filter out any undefined/null items
    return items.filter(
      (item: Accident | null | undefined): item is Accident =>
        item != null && item.id != null
    );
  }, [data]);

  // Get total count from first page
  const totalCount = useMemo(() => {
    if (!data?.pages || !Array.isArray(data.pages) || data.pages.length === 0)
      return 0;
    return data.pages[0]?.total ?? 0;
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--cta)]" />
      </div>
    );
  }

  const hasAccidents = Array.isArray(accidents) && accidents.length > 0;

  if (!hasAccidents) {
    return <NoData />;
  }

  return (
    <div className="space-y-4">
      {/* Total Count Display */}
      <div className="flex items-center justify-between px-1">
        <div className="text-sm text-[var(--muted)]">
          <span>Total Records: </span>
          <span className="font-semibold text-[var(--on-white-text)]">
            {totalCount.toLocaleString()}
          </span>
          {accidents.length > 0 && (
            <>
              <span className="mx-2">•</span>
              <span>Currently Loaded: {accidents.length.toLocaleString()}</span>
            </>
          )}
        </div>
        {accidents.length > 0 && (
          <div className="text-sm text-[var(--muted)]">
            Page {data?.pages?.length || 1}
          </div>
        )}
      </div>

      <div className="rounded-md border border-[var(--border-color)] bg-[var(--card_full_white)] overflow-hidden">
        <Table>
          <TableHeader className="bg-[var(--background)]/80">
            <TableRow>
              <TableHead className="w-[100px]">Severity</TableHead>
              <TableHead className="w-[180px]">Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="hidden md:table-cell">Weather</TableHead>
              <TableHead className="hidden lg:table-cell">
                Description
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(accidents || []).map((accident) => {
              if (!accident) return null;
              return (
                <TableRow
                  key={accident.id}
                  className="hover:bg-[var(--background)]/50 transition-colors"
                >
                  <TableCell>
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                      style={{
                        backgroundColor: `var(--severity-${
                          accident.severity ?? 1
                        })`,
                      }}
                    >
                      {SEVERITY_LABELS[accident.severity ?? 1]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--on-white-text)]">
                        {format(new Date(accident.startTime), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {format(new Date(accident.startTime), "h:mm a")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--on-white-text)]">
                        {accident.city}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {accident.state}, {accident.zipcode}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2 text-[var(--text)]">
                      {accident.weatherCondition}
                      {accident.temperature && (
                        <span className="text-xs text-[var(--muted)]">
                          ({accident.temperature}°F)
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[300px]">
                    <p
                      className="truncate text-[var(--text)]"
                      title={accident.description}
                    >
                      {accident.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAccident(accident)}
                      className="text-[var(--text)] hover:text-[var(--cta)] hover:bg-[var(--cta)]/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {hasNextPage && (
        <div className="flex flex-col items-center gap-3 pt-4">
          <div className="text-sm text-[var(--muted)]">
            {accidents.length} of {totalCount.toLocaleString()} records loaded
            {totalCount > accidents.length && (
              <span className="ml-1">
                ({((accidents.length / totalCount) * 100).toFixed(1)}%)
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage || autoLoadEnabled}
              className="min-w-[200px] border-[var(--cta)] text-[var(--cta)] hover:bg-[var(--cta)] hover:text-white"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading more...
                </>
              ) : (
                <>
                  Load More Records
                  <span className="ml-2 text-xs">
                    (Next {Math.min(100, totalCount - accidents.length)})
                  </span>
                </>
              )}
            </Button>
            <Button
              variant={autoLoadEnabled ? "destructive" : "default"}
              onClick={() => setAutoLoadEnabled(!autoLoadEnabled)}
              disabled={isFetchingNextPage}
              className="min-w-[150px]"
            >
              {autoLoadEnabled ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Stop Auto-Load
                </>
              ) : (
                "Auto-Load All"
              )}
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={!!selectedAccident}
        onOpenChange={(open) => !open && setSelectedAccident(null)}
      >
        <DialogContent className="max-w-2xl bg-[var(--card_full_white)] border-[var(--border-color)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              Accident Details
              {selectedAccident && (
                <Badge
                  className="text-white border-0"
                  style={{
                    backgroundColor: getSeverityColor(
                      selectedAccident.severity
                    ),
                  }}
                >
                  Severity: {SEVERITY_LABELS[selectedAccident.severity]}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>ID: {selectedAccident?.id}</DialogDescription>
          </DialogHeader>

          {selectedAccident && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-[var(--muted)] flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Time
                    </h4>
                    <p className="text-[var(--text)]">
                      Start:{" "}
                      {format(new Date(selectedAccident.startTime), "PPpp")}
                    </p>
                    <p className="text-[var(--text)]">
                      End: {format(new Date(selectedAccident.endTime), "PPpp")}
                    </p>
                    <p className="text-[var(--text)]">
                      Duration:{" "}
                      {Math.round(selectedAccident.durationSeconds / 60)} mins
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-[var(--muted)] flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Location
                    </h4>
                    <p className="text-[var(--text)]">
                      {selectedAccident.street}, {selectedAccident.city}
                    </p>
                    <p className="text-[var(--text)]">
                      {selectedAccident.county}, {selectedAccident.state}{" "}
                      {selectedAccident.zipcode}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      Lat: {selectedAccident.startLat}, Lng:{" "}
                      {selectedAccident.startLng}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[var(--muted)] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Description
                  </h4>
                  <p className="text-[var(--text)] bg-[var(--background)] p-3 rounded-md text-sm leading-relaxed">
                    {selectedAccident.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-[var(--muted)] flex items-center gap-2">
                      <Thermometer className="w-4 h-4" /> Temp
                    </h4>
                    <p className="text-[var(--text)]">
                      {selectedAccident.temperature}°F
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-[var(--muted)] flex items-center gap-2">
                      <Wind className="w-4 h-4" /> Wind
                    </h4>
                    <p className="text-[var(--text)]">
                      {selectedAccident.windSpeed} mph{" "}
                      {selectedAccident.windDirection}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-[var(--muted)]">
                      Humidity
                    </h4>
                    <p className="text-[var(--text)]">
                      {selectedAccident.humidity}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-[var(--muted)]">
                      Visibility
                    </h4>
                    <p className="text-[var(--text)]">
                      {selectedAccident.visibility} miles
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[var(--muted)]">
                    Road Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedAccident)
                      .filter(
                        ([key, value]) =>
                          typeof value === "boolean" &&
                          value === true &&
                          !["amenity", "noExit"].includes(key)
                      )
                      .map(([key]) => (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="capitalize"
                        >
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </Badge>
                      ))}
                    {Object.entries(selectedAccident).filter(
                      ([_key, value]) =>
                        typeof value === "boolean" && value === true
                    ).length === 0 && (
                      <span className="text-sm text-[var(--muted)]">
                        No special road features reported
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
