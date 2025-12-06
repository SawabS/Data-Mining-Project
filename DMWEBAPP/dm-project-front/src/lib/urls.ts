import { ENUMs } from "./enums";
const API = ENUMs.GLOBAL.API;

export const URLs = {
  GET_ACCIDENTS: `${API}/accident`,
  GET_TEMPORAL_HEATMAP: `${API}/accident/temporal-heatmap`,
  GET_FILTER_OPTIONS: `${API}/accident/filter-options`,
  GET_HEXBIN_MAP: `${API}/accident/hexbin-map`,
  GET_PARALLEL_COORDINATES:
   `${API}/accident/parallel-coordinates`,
  GET_TREEMAP: `${API}/accident/treemap`,
  GET_STACKED_BAR: `${API}/accident/stacked-bar`,
} as const;
