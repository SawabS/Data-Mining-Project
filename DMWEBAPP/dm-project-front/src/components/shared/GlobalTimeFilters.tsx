import { useAppQueryParams } from "@/hooks/useAppQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TIME_OF_DAY_OPTIONS,
  MONTH_OPTIONS,
  DAY_OF_WEEK_OPTIONS,
} from "@/lib/enums";
import { Calendar, Clock, Sun, Moon } from "lucide-react";

// Generate year options from 2016 to 2023 (data range: Feb 2016 - Mar 2023)
const YEAR_OPTIONS = [
  { value: "all", label: "All Years (2016-2023)" },
  { value: "2016", label: "2016" },
  { value: "2017", label: "2017" },
  { value: "2018", label: "2018" },
  { value: "2019", label: "2019" },
  { value: "2020", label: "2020" },
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
  { value: "2023", label: "2023" },
];

export const GlobalTimeFilters = () => {
  const { queries, setQueries } = useAppQueryParams();

  const handleYearChange = (value: string) => {
    setQueries({ year: value === "all" ? "" : value });
  };

  const handleMonthChange = (value: string) => {
    setQueries({ month: value === "all" ? "" : value });
  };

  const handleDayOfWeekChange = (value: string) => {
    setQueries({ day_of_week: value === "all" ? "" : value });
  };

  const handleTimeOfDayChange = (value: string) => {
    setQueries({ time_of_day: value === "all" ? "" : value });
  };

  const hasActiveFilters =
    queries.year || queries.month || queries.day_of_week || queries.time_of_day;

  const clearAllFilters = () => {
    setQueries({
      year: "",
      month: "",
      day_of_week: "",
      time_of_day: "",
    });
  };

  return (
    <div className="w-full p-4 rounded-xl bg-[var(--card_full_white)] border border-[var(--border-color)]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--cta)]" />
            <span className="text-sm font-medium text-[var(--on-white-text)]">
              Time Frame Filters
            </span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[var(--destructive)] hover:text-[var(--warning)] transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Year Filter */}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--muted)] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Year
            </label>
            <Select
              value={queries.year || "all"}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-full bg-[var(--background)] border-[var(--border-color)] text-[var(--text)] text-sm h-9">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--card_full_white)] border-[var(--border-color)]">
                {YEAR_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[var(--text)] focus:bg-[var(--background)] focus:text-[var(--cta)]"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter */}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--muted)] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Month
            </label>
            <Select
              value={queries.month || "all"}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-full bg-[var(--background)] border-[var(--border-color)] text-[var(--text)] text-sm h-9">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--card_full_white)] border-[var(--border-color)]">
                {MONTH_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[var(--text)] focus:bg-[var(--background)] focus:text-[var(--cta)]"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Day of Week Filter */}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--muted)] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Day of Week
            </label>
            <Select
              value={queries.day_of_week || "all"}
              onValueChange={handleDayOfWeekChange}
            >
              <SelectTrigger className="w-full bg-[var(--background)] border-[var(--border-color)] text-[var(--text)] text-sm h-9">
                <SelectValue placeholder="All Days" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--card_full_white)] border-[var(--border-color)]">
                {DAY_OF_WEEK_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[var(--text)] focus:bg-[var(--background)] focus:text-[var(--cta)]"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time of Day Filter */}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--muted)] flex items-center gap-1">
              {queries.time_of_day === "night" ? (
                <Moon className="w-3 h-3" />
              ) : (
                <Sun className="w-3 h-3" />
              )}
              Time of Day
            </label>
            <Select
              value={queries.time_of_day || "all"}
              onValueChange={handleTimeOfDayChange}
            >
              <SelectTrigger className="w-full bg-[var(--background)] border-[var(--border-color)] text-[var(--text)] text-sm h-9">
                <SelectValue placeholder="All Times" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--card_full_white)] border-[var(--border-color)]">
                {TIME_OF_DAY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[var(--text)] focus:bg-[var(--background)] focus:text-[var(--cta)]"
                  >
                    <div className="flex items-center gap-2">
                      {option.value === "day" && (
                        <Sun className="w-3 h-3 text-[var(--warning)]" />
                      )}
                      {option.value === "night" && (
                        <Moon className="w-3 h-3 text-[var(--cta)]" />
                      )}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-color)]">
            <span className="text-xs text-[var(--muted)]">Active:</span>
            {queries.year && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--cta)]/20 text-[var(--cta)]">
                {queries.year}
              </span>
            )}
            {queries.month && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary_girl)]/20 text-[var(--primary_girl)]">
                {MONTH_OPTIONS.find((m) => m.value === queries.month)?.label}
              </span>
            )}
            {queries.day_of_week && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--success)]/20 text-[var(--success)]">
                {queries.day_of_week}
              </span>
            )}
            {queries.time_of_day && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--warning)]/20 text-[var(--warning)] flex items-center gap-1">
                {queries.time_of_day === "day" ? (
                  <>
                    <Sun className="w-3 h-3" /> Daytime
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3" /> Nighttime
                  </>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalTimeFilters;
