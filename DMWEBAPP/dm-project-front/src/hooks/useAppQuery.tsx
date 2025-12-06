import { ENUMs } from "@/lib/enums";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export function useAppQueryParams() {
  const [queries, setQueries] = useQueryStates({
    [ENUMs.PARAMS.PAGE]: parseAsInteger.withDefault(1),
    [ENUMs.PARAMS.LIMIT]: parseAsInteger.withDefault(100),
    [ENUMs.PARAMS.SEARCH]: parseAsString.withDefault(""),
    [ENUMs.PARAMS.STATE]: parseAsString.withDefault(""),
    [ENUMs.PARAMS.CITY]: parseAsString.withDefault(""),
    [ENUMs.PARAMS.SEVERITY]: parseAsString.withDefault(""),
    [ENUMs.PARAMS.DATE_LIMIT]: parseAsString.withDefault("10000"),
    [ENUMs.PARAMS.POI]: parseAsString.withDefault(""),
    [ENUMs.PARAMS.YEAR]: parseAsString.withDefault(""),
    [ENUMs.PARAMS.MONTH]: parseAsString.withDefault(""),
    [ENUMs.PARAMS.DAY_OF_WEEK]: parseAsString.withDefault(""),
    [ENUMs.PARAMS.TIME_OF_DAY]: parseAsString.withDefault(""),
  });

  return {
    queries,
    setQueries,
  };
}
