import { useToast } from "@/components/ui/use-toast";
import { QueryParam, TimeFrameFilters } from "@/types/global";
import {
  getAccidents,
  getFilterOptions,
  getTemporalHeatmap,
  getHexbinMapData,
  getParallelCoordinatesData,
  getTreemapData,
  getStackedBarData,
} from "../actions/accident.action";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QUERY_KEYs } from "../keys";
import { useAppQueryParams } from "@/hooks/useAppQuery";

// Cache configuration - data doesn't change frequently, so use longer stale times
const CACHE_CONFIG = {
  // Filter options rarely change - cache for 30 minutes
  filterOptions: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
  },
  // Aggregated data can be stale for 10 minutes
  aggregatedData: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },
  // Large datasets - cache longer
  largeData: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 45 * 60 * 1000, // 45 minutes
  },
};

// Helper to get time frame filters from queries
const useTimeFrameFilters = (): TimeFrameFilters => {
  const { queries } = useAppQueryParams();
  return {
    year: queries.year || undefined,
    month: queries.month || undefined,
    dayOfWeek: queries.day_of_week || undefined,
    timeOfDay: (queries.time_of_day as 'day' | 'night' | undefined) || undefined,
  };
};

export const useGetAccidents = (queryKey: [string, QueryParam]) => {
  const { toast } = useToast();
  const [name, params] = queryKey;

  return useInfiniteQuery({
    queryKey: [name, params],
    queryFn: ({ pageParam }) => getAccidents(toast, params, pageParam),
    initialPageParam: 1 as number | string,
    getNextPageParam: (lastPage) => {
      // Use cursor-based pagination if available, otherwise fall back to page-based
      if (lastPage.hasMore && lastPage.nextCursor) {
        return lastPage.nextCursor;
      }
      // Fall back to page-based pagination
      if (lastPage.next) {
        return (lastPage.page ?? 0) + 1;
      }
      return undefined;
    },
    ...CACHE_CONFIG.aggregatedData,
  });
};

export const useGetTemporalHeatmap = (city?: string, state?: string) => {
  const { toast } = useToast();
  const timeFilters = useTimeFrameFilters();

  return useQuery({
    queryKey: [QUERY_KEYs.TEMPORAL_HEATMAP, city, state, timeFilters],
    queryFn: () => getTemporalHeatmap(toast, city, state, timeFilters),
    ...CACHE_CONFIG.aggregatedData,
    // Only refetch when filters change
    refetchOnWindowFocus: false,
  });
};

export const useGetFilterOptions = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: [QUERY_KEYs.FILTER_OPTIONS],
    queryFn: () => getFilterOptions(toast),
    ...CACHE_CONFIG.filterOptions,
    // Filter options rarely change
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useGetHexbinMapData = (state?: string) => {
  const { toast } = useToast();
  const timeFilters = useTimeFrameFilters();

  return useQuery({
    queryKey: [QUERY_KEYs.HEXBIN_MAP, state, timeFilters],
    queryFn: () => getHexbinMapData(toast, state, timeFilters),
    ...CACHE_CONFIG.largeData,
    refetchOnWindowFocus: false,
  });
};

export const useGetParallelCoordinatesData = (
  severity?: number,
  limit?: number
) => {
  const { toast } = useToast();
  const timeFilters = useTimeFrameFilters();

  return useQuery({
    queryKey: [QUERY_KEYs.PARALLEL_COORDINATES, severity, limit, timeFilters],
    queryFn: () => getParallelCoordinatesData(toast, severity, limit, timeFilters),
    ...CACHE_CONFIG.largeData,
    refetchOnWindowFocus: false,
  });
};

export const useGetTreemapData = (state?: string) => {
  const { toast } = useToast();
  const timeFilters = useTimeFrameFilters();

  return useQuery({
    queryKey: [QUERY_KEYs.TREEMAP, state, timeFilters],
    queryFn: () => getTreemapData(toast, state, timeFilters),
    ...CACHE_CONFIG.largeData,
    refetchOnWindowFocus: false,
  });
};

export const useGetStackedBarData = (poiType?: string) => {
  const { toast } = useToast();
  const timeFilters = useTimeFrameFilters();

  return useQuery({
    queryKey: [QUERY_KEYs.STACKED_BAR, poiType, timeFilters],
    queryFn: () => getStackedBarData(toast, poiType, timeFilters),
    ...CACHE_CONFIG.aggregatedData,
    refetchOnWindowFocus: false,
  });
};
