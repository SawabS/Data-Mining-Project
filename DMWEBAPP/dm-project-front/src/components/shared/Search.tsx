import { ENUMs, SEVERITY_LABELS, STATE_NAMES } from "@/lib/enums";
import {
  Search as SearchIcon,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetFilterOptions } from "@/lib/react-query/query/accident.query";
import { Badge } from "../ui/badge";

const Search = ({
  className,
  placeholder,
  ...props
}: React.PropsWithChildren<React.ComponentProps<"input">>) => {
  const { queries, setQueries } = useAppQueryParams();
  const { data: filterOptions } = useGetFilterOptions();
  const [showFilters, setShowFilters] = useState(false);
  let { search, state, city, severity } = queries;

  useEffect(() => {
    setQueries((prev) => ({
      ...prev,
      [ENUMs.PARAMS.PAGE]: 0,
    }));
  }, [search, state, city, severity]);

  const activeFiltersCount = [state, city, severity].filter(
    (f) => f && f !== "all"
  ).length;

  const clearAllFilters = () => {
    setQueries((prev) => ({
      ...prev,
      [ENUMs.PARAMS.SEARCH]: "",
      [ENUMs.PARAMS.STATE]: "all",
      [ENUMs.PARAMS.CITY]: "all",
      [ENUMs.PARAMS.SEVERITY]: "all",
    }));
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--card_full_white)] overflow-hidden">
          <Input
            onChange={(e) =>
              setQueries((prev) => ({
                ...prev,
                [ENUMs.PARAMS.SEARCH]: e.target.value,
              }))
            }
            value={search}
            placeholder={
              placeholder ?? "Search by description, street, city..."
            }
            className={cn(
              className,
              "rounded-xl px-4 py-3 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[var(--on-white-text)] placeholder:text-[var(--muted)]"
            )}
            type="text"
            {...props}
          />

          {search === "" && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 transform -translate-y-1/2 end-2 text-[var(--muted)]"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          )}
          {search !== "" && (
            <Button
              onClick={() =>
                setQueries((prev) => ({
                  ...prev,
                  [ENUMs.PARAMS.SEARCH]: "",
                }))
              }
              variant="ghost"
              size="icon"
              className="absolute top-1/2 transform -translate-y-1/2 end-2 text-[var(--muted)] hover:text-[var(--destructive)]"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "rounded-xl px-4 py-3 h-auto border-[var(--border-color)] bg-[var(--card_full_white)] text-[var(--text)] hover:bg-[var(--cta)] hover:text-white transition-all gap-2",
            showFilters && "bg-[var(--cta)] text-white"
          )}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-[var(--destructive)] text-white">
              {activeFiltersCount}
            </Badge>
          )}
          {showFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card_full_white)] space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[var(--text)]">
              Advanced Filters
            </h3>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-[var(--destructive)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* State Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted)]">
                State
              </label>
              <Select
                value={state || "all"}
                onValueChange={(value) =>
                  setQueries((prev) => ({
                    ...prev,
                    [ENUMs.PARAMS.STATE]: value,
                    [ENUMs.PARAMS.CITY]: "all", // Reset city when state changes
                  }))
                }
              >
                <SelectTrigger className="rounded-lg border-[var(--border-color)] bg-[var(--background)] text-[var(--text)]">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card_full_white)] border-[var(--border-color)]">
                  <SelectItem value="all">All States</SelectItem>
                  {filterOptions?.states?.map((s: string) => (
                    <SelectItem key={s} value={s}>
                      {STATE_NAMES[s] ? `${STATE_NAMES[s]} (${s})` : s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted)]">
                City
              </label>
              <Select
                value={city || "all"}
                onValueChange={(value) =>
                  setQueries((prev) => ({
                    ...prev,
                    [ENUMs.PARAMS.CITY]: value,
                  }))
                }
              >
                <SelectTrigger className="rounded-lg border-[var(--border-color)] bg-[var(--background)] text-[var(--text)]">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card_full_white)] border-[var(--border-color)] max-h-[200px]">
                  <SelectItem value="all">All Cities</SelectItem>
                  {filterOptions?.cities?.map((c: string) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted)]">
                Severity Level
              </label>
              <Select
                value={severity || "all"}
                onValueChange={(value) =>
                  setQueries((prev) => ({
                    ...prev,
                    [ENUMs.PARAMS.SEVERITY]: value,
                  }))
                }
              >
                <SelectTrigger className="rounded-lg border-[var(--border-color)] bg-[var(--background)] text-[var(--text)]">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card_full_white)] border-[var(--border-color)]">
                  <SelectItem value="all">All Severities</SelectItem>
                  {[1, 2, 3, 4].map((sev) => (
                    <SelectItem key={sev} value={String(sev)}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: `var(--severity-${sev})` }}
                        />
                        Level {sev} - {SEVERITY_LABELS[sev]}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-color)]">
              {state && state !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-[var(--cta)]/10 text-[var(--cta)] border border-[var(--cta)]/20 gap-1"
                >
                  State: {state}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-[var(--destructive)]"
                    onClick={() =>
                      setQueries((prev) => ({
                        ...prev,
                        [ENUMs.PARAMS.STATE]: "all",
                      }))
                    }
                  />
                </Badge>
              )}
              {city && city !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-[var(--primary_girl)]/10 text-[var(--primary_girl)] border border-[var(--primary_girl)]/20 gap-1"
                >
                  City: {city}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-[var(--destructive)]"
                    onClick={() =>
                      setQueries((prev) => ({
                        ...prev,
                        [ENUMs.PARAMS.CITY]: "all",
                      }))
                    }
                  />
                </Badge>
              )}
              {severity && severity !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20 gap-1"
                >
                  Severity: {SEVERITY_LABELS[parseInt(severity)]}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-[var(--destructive)]"
                    onClick={() =>
                      setQueries((prev) => ({
                        ...prev,
                        [ENUMs.PARAMS.SEVERITY]: "all",
                      }))
                    }
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
