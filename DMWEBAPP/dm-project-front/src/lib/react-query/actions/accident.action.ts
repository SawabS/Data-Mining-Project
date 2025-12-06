import { api } from "@/lib/config/api.config";
import { buildQueryString, generateNestErrors } from "@/lib/functions";
import { URLs } from "@/lib/urls";
import { QueryParam, ToastType, TimeFrameFilters } from "@/types/global";

// Helper to add time frame filters to URLSearchParams
const addTimeFilters = (params: URLSearchParams, timeFilters?: TimeFrameFilters) => {
  if (timeFilters?.year) params.append("year", timeFilters.year);
  if (timeFilters?.month) params.append("month", timeFilters.month);
  if (timeFilters?.dayOfWeek) params.append("dayOfWeek", timeFilters.dayOfWeek);
  if (timeFilters?.timeOfDay) params.append("timeOfDay", timeFilters.timeOfDay);
};

export const buildUrl = (baseUrl: string, queries?: QueryParam) => {
  if (!queries || Object.keys(queries).length === 0) return baseUrl;

  const queryString = buildQueryString(queries);

  return baseUrl.includes("?")
    ? `${baseUrl}&${queryString}`
    : `${baseUrl}?${queryString}`;
};

export const getAccidents = async (
  toast: ToastType,
  queries?: QueryParam,
  pageParam: number | string = 1
) => {
  try {
    // Support both page-based and cursor-based pagination
    const paginationParams: QueryParam = {};
    
    if (typeof pageParam === 'string' && pageParam !== '1') {
      // Cursor-based pagination
      paginationParams.cursor = pageParam;
    } else {
      // Page-based pagination
      paginationParams.page = typeof pageParam === 'number' ? pageParam : 1;
    }
    
    // Limit to 100 items per chunk for efficient loading
    paginationParams.limit = 100;

    // Filter out empty/undefined query params to avoid filtering data
    const cleanedQueries = Object.entries(queries || {}).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined && value !== 'all') {
        acc[key] = value;
      }
      return acc;
    }, {} as QueryParam);

    const fullUrl = buildUrl(`${URLs.GET_ACCIDENTS}`, {
      ...cleanedQueries,
      ...paginationParams,
    });

    const { data } = await api.get(fullUrl);
    
    // Ensure the response has the required properties for infinite scroll
    return {
      ...data,
      // Map hasMore to next for compatibility with DataBox
      next: data.hasMore ?? (data.data?.length >= 100),
      page: data.page ?? 1,
    };
  } catch (error: any) {
    throw generateNestErrors(error, toast);
  }
};

// Types for Temporal Heatmap
export type HeatmapCell = {
  hour: number;
  dayOfWeek: string;
  count: number;
};

export type TemporalHeatmapData = {
  data: HeatmapCell[];
  maxCount: number;
  totalAccidents: number;
};

export type FilterOptions = {
  cities: string[];
  states: string[];
};

// Types for Hexbin Map
export type HexbinPoint = {
  lat: number;
  lng: number;
  count: number;
};

export type HexbinMapData = {
  points: HexbinPoint[];
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  totalAccidents: number;
};

// Types for Parallel Coordinates
export type WeatherAccidentPoint = {
  temperature: number;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  severity: number;
};

export type ParallelCoordinatesData = {
  data: WeatherAccidentPoint[];
  ranges: {
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    pressure: { min: number; max: number };
    visibility: { min: number; max: number };
    windSpeed: { min: number; max: number };
  };
  totalCount: number;
};

// Types for Treemap
export type TreemapNode = {
  name: string;
  value: number;
  avgSeverity: number;
  children?: TreemapNode[];
};

export type TreemapData = {
  data: TreemapNode;
  totalAccidents: number;
};

// Types for Stacked Bar
export type SeverityCount = {
  severity1: number;
  severity2: number;
  severity3: number;
  severity4: number;
  total: number;
};

export type POICategory = {
  category: string;
  present: SeverityCount;
  absent: SeverityCount;
};

export type StackedBarData = {
  data: POICategory[];
};

// API Functions
export const getTemporalHeatmap = async (
  toast: ToastType,
  city?: string,
  state?: string,
  timeFilters?: TimeFrameFilters
): Promise<TemporalHeatmapData> => {
  try {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (state) params.append("state", state);
    addTimeFilters(params, timeFilters);

    const queryString = params.toString();
    const url = queryString
      ? `${URLs.GET_TEMPORAL_HEATMAP}?${queryString}`
      : URLs.GET_TEMPORAL_HEATMAP;

    const { data } = await api.get(url);
    return data;
  } catch (error: any) {
    throw generateNestErrors(error, toast);
  }
};

export const getFilterOptions = async (
  toast: ToastType
): Promise<FilterOptions> => {
  try {
    const { data } = await api.get(URLs.GET_FILTER_OPTIONS);
    return data;
  } catch (error: any) {
    throw generateNestErrors(error, toast);
  }
};

export const getHexbinMapData = async (
  toast: ToastType,
  state?: string,
  timeFilters?: TimeFrameFilters
): Promise<HexbinMapData> => {
  try {
    const params = new URLSearchParams();
    if (state) params.append("state", state);
    addTimeFilters(params, timeFilters);

    const queryString = params.toString();
    const url = queryString
      ? `${URLs.GET_HEXBIN_MAP}?${queryString}`
      : URLs.GET_HEXBIN_MAP;

    const { data } = await api.get(url);
    return data;
  } catch (error: any) {
    throw generateNestErrors(error, toast);
  }
};

export const getParallelCoordinatesData = async (
  toast: ToastType,
  severity?: number,
  limit?: number,
  timeFilters?: TimeFrameFilters
): Promise<ParallelCoordinatesData> => {
  try {
    const params = new URLSearchParams();
    if (severity) params.append("severity", severity.toString());
    if (limit) params.append("limit", limit.toString());
    addTimeFilters(params, timeFilters);

    const queryString = params.toString();
    const url = queryString
      ? `${URLs.GET_PARALLEL_COORDINATES}?${queryString}`
      : URLs.GET_PARALLEL_COORDINATES;

    const { data } = await api.get(url);
    return data;
  } catch (error: any) {
    throw generateNestErrors(error, toast);
  }
};

export const getTreemapData = async (
  toast: ToastType,
  state?: string,
  timeFilters?: TimeFrameFilters
): Promise<TreemapData> => {
  try {
    const params = new URLSearchParams();
    if (state) params.append("state", state);
    addTimeFilters(params, timeFilters);

    const queryString = params.toString();
    const url = queryString
      ? `${URLs.GET_TREEMAP}?${queryString}`
      : URLs.GET_TREEMAP;

    const { data } = await api.get(url);
    return data;
  } catch (error: any) {
    throw generateNestErrors(error, toast);
  }
};

export const getStackedBarData = async (
  toast: ToastType,
  poiType?: string,
  timeFilters?: TimeFrameFilters
): Promise<StackedBarData> => {
  try {
    const params = new URLSearchParams();
    if (poiType) params.append("poiType", poiType);
    addTimeFilters(params, timeFilters);

    const queryString = params.toString();
    const url = queryString
      ? `${URLs.GET_STACKED_BAR}?${queryString}`
      : URLs.GET_STACKED_BAR;

    const { data } = await api.get(url);
    return data;
  } catch (error: any) {
    throw generateNestErrors(error, toast);
  }
};
