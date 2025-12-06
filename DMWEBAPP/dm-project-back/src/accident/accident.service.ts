import { Injectable } from '@nestjs/common';
import { Accident, Prisma } from '@prisma/client';
import { buildPagination } from 'lib/functions';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationParams, PaginationType, QueryParam } from 'src/types/global';
import * as crypto from 'crypto';

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

// Types for Hexbin Map (Geospatial)
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

// Types for Parallel Coordinates Plot
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

// Types for Stacked Bar Chart (POI Analysis)
export type POICategory = {
  category: string;
  present: {
    severity1: number;
    severity2: number;
    severity3: number;
    severity4: number;
    total: number;
  };
  absent: {
    severity1: number;
    severity2: number;
    severity3: number;
    severity4: number;
    total: number;
  };
};

export type StackedBarData = {
  data: POICategory[];
};

// Simple in-memory cache for expensive queries
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

@Injectable()
export class AccidentService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly prismaService: PrismaService) {}

  // Cache helper methods
  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private setCache<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  // OPTIMIZED: Cursor-based pagination for better performance on large datasets
  async get(
    pagination: PaginationParams,
    query: QueryParam,
  ): Promise<PaginationType<Partial<Accident>>> {
    const { page, limit, cursor } = pagination;
    // Cap limit at 200 to allow larger chunks for efficient data loading
    const safeLimit = Math.min(limit || 50, 200);
    
    let where: Prisma.AccidentWhereInput = {};

    if (query.search) {
      where.OR = [
        { city: { contains: query.search } },
        { state: { contains: query.search } },
        { county: { contains: query.search } },
      ];
    }
    
    // Filter by state (ignore "all")
    if (query.state && query.state !== 'all') {
      where.state = query.state;
    }

    // Filter by city (ignore "all")
    if (query.city && query.city !== 'all') {
      where.city = { contains: query.city };
    }

    // Filter by severity (ignore "all")
    if (query.severity && query.severity !== 'all') {
      const severityNum = parseInt(query.severity);
      if (!isNaN(severityNum) && severityNum >= 1 && severityNum <= 4) {
        where.severity = severityNum;
      }
    }

    // Use cursor-based pagination if cursor provided (more efficient)
    if (cursor) {
      where.id = { lt: cursor };
    }

    // Cache the count for filtered queries to avoid expensive COUNT on every request
    const cacheKey = `count-${JSON.stringify(where)}`;
    let total = this.getCached<number>(cacheKey);
    
    const [countResult, data] = await Promise.all([
      // Get count if not cached or first page
      total === null ? this.prismaService.accident.count({ where }) : Promise.resolve(total),
      this.prismaService.accident.findMany({
        where,
        take: safeLimit + 1, // Fetch one extra to determine hasMore
        orderBy: { id: 'desc' }, // Consistent ordering for cursor pagination
        select: {
          id: true,
          severity: true,
          city: true,
          state: true,
          county: true,
          zipcode: true,
          startTime: true,
          description: true,
          startLat: true,
          startLng: true,
          weatherCondition: true,
          temperature: true,
        },
      }),
    ]);
    
    total = countResult;
    // Cache count for 2 minutes
    if (total !== null) {
      this.setCache(cacheKey, total, 2 * 60 * 1000);
    }

    // Check if there are more results
    const hasMore = data.length > safeLimit;
    const results = hasMore ? data.slice(0, safeLimit) : data;
    const nextCursor = hasMore && results.length > 0 ? results[results.length - 1].id : undefined;

    const meta = buildPagination(total, page, safeLimit);
    return { 
      data: results, 
      ...meta,
      hasMore,
      nextCursor,
    };
  }

  // Helper to build time frame where clause
  private buildTimeFrameWhereClause(query: QueryParam): { clause: string; params: any[] } {
    let whereClause = '1=1';
    const params: any[] = [];

    if (query.city) {
      whereClause += ' AND city LIKE ?';
      params.push(`%${query.city}%`);
    }

    if (query.state) {
      whereClause += ' AND state = ?';
      params.push(query.state);
    }

    // Time frame filters
    if (query.year) {
      whereClause += ' AND year = ?';
      params.push(parseInt(query.year));
    }

    if (query.month) {
      whereClause += ' AND month = ?';
      params.push(parseInt(query.month));
    }

    if (query.dayOfWeek) {
      whereClause += ' AND dayOfWeek = ?';
      params.push(query.dayOfWeek);
    }

    if (query.timeOfDay === 'day') {
      // Daytime: 6 AM to 6 PM (hours 6-17)
      whereClause += ' AND hour >= 6 AND hour < 18';
    } else if (query.timeOfDay === 'night') {
      // Nighttime: 6 PM to 6 AM (hours 18-23 and 0-5)
      whereClause += ' AND (hour >= 18 OR hour < 6)';
    }

    return { clause: whereClause, params };
  }

  // OPTIMIZED: Use raw SQL for temporal heatmap aggregation
  async getTemporalHeatmap(query: QueryParam): Promise<TemporalHeatmapData> {
    const cacheKey = `temporal-heatmap-${query.city || 'all'}-${query.state || 'all'}-${query.year || 'all'}-${query.month || 'all'}-${query.dayOfWeek || 'all'}-${query.timeOfDay || 'all'}`;
    const cached = this.getCached<TemporalHeatmapData>(cacheKey);
    if (cached) return cached;

    const { clause: whereClause, params } = this.buildTimeFrameWhereClause(query);

    const result = await this.prismaService.$queryRawUnsafe<
      { hour: number; dayOfWeek: string; count: bigint }[]
    >(
      `SELECT hour, dayOfWeek, COUNT(*) as count 
       FROM Accident 
       WHERE ${whereClause}
       GROUP BY hour, dayOfWeek`,
      ...params,
    );

    const data: HeatmapCell[] = result.map((item) => ({
      hour: item.hour,
      dayOfWeek: item.dayOfWeek,
      count: Number(item.count),
    }));

    const maxCount = Math.max(...data.map((d) => d.count), 0);
    const totalAccidents = data.reduce((sum, d) => sum + d.count, 0);

    const response = { data, maxCount, totalAccidents };
    this.setCache(cacheKey, response);
    return response;
  }

  // OPTIMIZED: Cache filter options since they rarely change
  async getFilterOptions(): Promise<{ cities: string[]; states: string[] }> {
    const cacheKey = 'filter-options';
    const cached = this.getCached<{ cities: string[]; states: string[] }>(cacheKey);
    if (cached) return cached;

    // Use raw SQL for faster distinct queries
    const [citiesResult, statesResult] = await Promise.all([
      this.prismaService.$queryRaw<{ city: string }[]>`
        SELECT DISTINCT city FROM Accident ORDER BY city LIMIT 200
      `,
      this.prismaService.$queryRaw<{ state: string }[]>`
        SELECT DISTINCT state FROM Accident ORDER BY state
      `,
    ]);

    const response = {
      cities: citiesResult.map((c) => c.city),
      states: statesResult.map((s) => s.state),
    };

    this.setCache(cacheKey, response, 10 * 60 * 1000); // 10 min cache
    return response;
  }

  // OPTIMIZED: Use raw SQL for hexbin aggregation
  async getHexbinMapData(query: QueryParam): Promise<HexbinMapData> {
    const cacheKey = `hexbin-${query.state || 'all'}-${query.year || 'all'}-${query.month || 'all'}-${query.dayOfWeek || 'all'}-${query.timeOfDay || 'all'}`;
    const cached = this.getCached<HexbinMapData>(cacheKey);
    if (cached) return cached;

    const gridSize = 0.1; // ~11km grid cells

    // Build where clause with time filters
    let whereClause = '1=1';
    
    if (query.state) {
      whereClause += ` AND state = '${query.state.replace(/'/g, "''")}'`;
    }
    
    if (query.year) {
      whereClause += ` AND year = ${parseInt(query.year)}`;
    }
    
    if (query.month) {
      whereClause += ` AND month = ${parseInt(query.month)}`;
    }
    
    if (query.dayOfWeek) {
      whereClause += ` AND dayOfWeek = '${query.dayOfWeek.replace(/'/g, "''")}'`;
    }
    
    if (query.timeOfDay === 'day') {
      whereClause += ' AND hour >= 6 AND hour < 18';
    } else if (query.timeOfDay === 'night') {
      whereClause += ' AND (hour >= 18 OR hour < 6)';
    }

    // Use raw SQL for server-side grid aggregation - much faster
    // Wrap in a derived table so GROUP BY columns exactly match SELECT columns (satisfies only_full_group_by)
    const pointsQuery = this.prismaService.$queryRawUnsafe<
      { gridLat: number; gridLng: number; cnt: bigint }[]
    >(
      `SELECT gridLat, gridLng, COUNT(*) as cnt
       FROM (
         SELECT 
           (FLOOR(startLat / ${gridSize}) * ${gridSize} + ${gridSize / 2}) as gridLat,
           (FLOOR(startLng / ${gridSize}) * ${gridSize} + ${gridSize / 2}) as gridLng
         FROM Accident
         WHERE ${whereClause} AND startLat IS NOT NULL AND startLng IS NOT NULL
       ) t
       GROUP BY gridLat, gridLng`,
    );

    // Get bounds separately
    const boundsQuery = this.prismaService.$queryRawUnsafe<
      { minLat: number; maxLat: number; minLng: number; maxLng: number }[]
    >(
      `SELECT 
        MIN(startLat) as minLat,
        MAX(startLat) as maxLat,
        MIN(startLng) as minLng,
        MAX(startLng) as maxLng
       FROM Accident
       WHERE ${whereClause} AND startLat IS NOT NULL AND startLng IS NOT NULL`,
    );

    const [result, boundsResult] = await Promise.all([pointsQuery, boundsQuery]);

    const points: HexbinPoint[] = result.map((r) => ({
      lat: Number(r.gridLat),
      lng: Number(r.gridLng),
      count: Number(r.cnt),
    }));

    const bounds = boundsResult.length > 0 && boundsResult[0].minLat != null
      ? {
          minLat: Number(boundsResult[0].minLat),
          maxLat: Number(boundsResult[0].maxLat),
          minLng: Number(boundsResult[0].minLng),
          maxLng: Number(boundsResult[0].maxLng),
        }
      : { minLat: 24, maxLat: 50, minLng: -125, maxLng: -66 };

    const totalAccidents = points.reduce((sum, p) => sum + p.count, 0);

    const response = { points, bounds, totalAccidents };
    this.setCache(cacheKey, response);
    return response;
  }

  // OPTIMIZED: Use sampling and raw SQL for parallel coordinates
  async getParallelCoordinatesData(
    severity?: number,
    limit: number = 2000,
    timeFilters?: QueryParam,
  ): Promise<ParallelCoordinatesData> {
    const cacheKey = `pcp-${severity || 'all'}-${limit}-${timeFilters?.year || 'all'}-${timeFilters?.month || 'all'}-${timeFilters?.dayOfWeek || 'all'}-${timeFilters?.timeOfDay || 'all'}`;
    const cached = this.getCached<ParallelCoordinatesData>(cacheKey);
    if (cached) return cached;

    let whereClause = '1=1';
    const params: any[] = [];

    if (severity) {
      whereClause += ' AND severity = ?';
      params.push(severity);
    }

    // Add time filters
    if (timeFilters?.year) {
      whereClause += ' AND year = ?';
      params.push(parseInt(timeFilters.year));
    }
    if (timeFilters?.month) {
      whereClause += ' AND month = ?';
      params.push(parseInt(timeFilters.month));
    }
    if (timeFilters?.dayOfWeek) {
      whereClause += ' AND dayOfWeek = ?';
      params.push(timeFilters.dayOfWeek);
    }
    if (timeFilters?.timeOfDay === 'day') {
      whereClause += ' AND hour >= 6 AND hour < 18';
    } else if (timeFilters?.timeOfDay === 'night') {
      whereClause += ' AND (hour >= 18 OR hour < 6)';
    }

    // Get total count first
    const countQuery = this.prismaService.$queryRawUnsafe<{ total: bigint }[]>(
      `SELECT COUNT(*) as total FROM Accident WHERE ${whereClause}`,
      ...params,
    );

    // OPTIMIZED: Use UUID-based sampling instead of ORDER BY RAND()
    // This avoids a full table scan and sort, using the primary key index instead
    const randomUuid = crypto.randomUUID();
    
    // Try to get data starting from a random point
    const sampleQuery = this.prismaService.$queryRawUnsafe<WeatherAccidentPoint[]>(
      `SELECT temperature, humidity, pressure, visibility, windSpeed, severity
       FROM Accident
       WHERE ${whereClause} AND id >= '${randomUuid}'
       LIMIT ?`,
      ...params,
      limit,
    );

    // Get ranges using aggregate queries (faster than scanning all data)
    const rangesQuery = this.prismaService.$queryRawUnsafe<any[]>(
      `SELECT 
        MIN(temperature) as minTemp, MAX(temperature) as maxTemp,
        MIN(humidity) as minHum, MAX(humidity) as maxHum,
        MIN(pressure) as minPres, MAX(pressure) as maxPres,
        MIN(visibility) as minVis, MAX(visibility) as maxVis,
        MIN(windSpeed) as minWind, MAX(windSpeed) as maxWind
       FROM Accident
       WHERE ${whereClause}`,
      ...params,
    );

    const [countResult, initialSampledData, rangesResult] = await Promise.all([
      countQuery,
      sampleQuery,
      rangesQuery,
    ]);

    const totalCount = Number(countResult[0]?.total || 0);
    let sampledData = initialSampledData;

    // If we didn't get enough data (random point was near end), wrap around to beginning
    if (sampledData.length < limit) {
      const remaining = limit - sampledData.length;
      const moreData = await this.prismaService.$queryRawUnsafe<WeatherAccidentPoint[]>(
        `SELECT temperature, humidity, pressure, visibility, windSpeed, severity
         FROM Accident
         WHERE ${whereClause} AND id < '${randomUuid}'
         LIMIT ?`,
        ...params,
        remaining,
      );
      sampledData = [...sampledData, ...moreData];
    }

    const data: WeatherAccidentPoint[] = sampledData.map((acc) => ({
      temperature: Number(acc.temperature),
      humidity: Number(acc.humidity),
      pressure: Number(acc.pressure),
      visibility: Number(acc.visibility),
      windSpeed: Number(acc.windSpeed),
      severity: Number(acc.severity),
    }));

    const ranges = rangesResult[0];

    const response: ParallelCoordinatesData = {
      data,
      ranges: {
        temperature: { min: Number(ranges?.minTemp || 0), max: Number(ranges?.maxTemp || 100) },
        humidity: { min: Number(ranges?.minHum || 0), max: Number(ranges?.maxHum || 100) },
        pressure: { min: Number(ranges?.minPres || 28), max: Number(ranges?.maxPres || 32) },
        visibility: { min: Number(ranges?.minVis || 0), max: Number(ranges?.maxVis || 10) },
        windSpeed: { min: Number(ranges?.minWind || 0), max: Number(ranges?.maxWind || 50) },
      },
      totalCount,
    };

    this.setCache(cacheKey, response, 3 * 60 * 1000); // 3 min cache for sampled data
    return response;
  }

  // OPTIMIZED: Use raw SQL for treemap aggregation
  async getTreemapData(state?: string, timeFilters?: QueryParam): Promise<TreemapData> {
    const cacheKey = `treemap-${state || 'all'}-${timeFilters?.year || 'all'}-${timeFilters?.month || 'all'}-${timeFilters?.dayOfWeek || 'all'}-${timeFilters?.timeOfDay || 'all'}`;
    const cached = this.getCached<TreemapData>(cacheKey);
    if (cached) return cached;

    let whereClause = '1=1';
    const params: any[] = [];

    if (state) {
      whereClause += ' AND state = ?';
      params.push(state);
    }

    // Add time filters
    if (timeFilters?.year) {
      whereClause += ' AND year = ?';
      params.push(parseInt(timeFilters.year));
    }
    if (timeFilters?.month) {
      whereClause += ' AND month = ?';
      params.push(parseInt(timeFilters.month));
    }
    if (timeFilters?.dayOfWeek) {
      whereClause += ' AND dayOfWeek = ?';
      params.push(timeFilters.dayOfWeek);
    }
    if (timeFilters?.timeOfDay === 'day') {
      whereClause += ' AND hour >= 6 AND hour < 18';
    } else if (timeFilters?.timeOfDay === 'night') {
      whereClause += ' AND (hour >= 18 OR hour < 6)';
    }

    // OPTIMIZED: Adaptive granularity
    // If filtering by state, show full detail (City level)
    // If viewing all US, show high-level (County level) to improve performance
    const groupByCity = !!state;

    const result = await this.prismaService.$queryRawUnsafe<
      { state: string; county: string; city?: string; count: bigint; avgSeverity: number }[]
    >(
      `SELECT state, county${groupByCity ? ', city' : ''}, 
        COUNT(*) as count, 
        AVG(severity) as avgSeverity
       FROM Accident
       WHERE ${whereClause}
       GROUP BY state, county${groupByCity ? ', city' : ''}`,
      ...params,
    );

    // Build hierarchical structure efficiently
    const stateMap = new Map<string, Map<string, Map<string, { count: number; avgSeverity: number }>>>();

    result.forEach((row) => {
      if (!stateMap.has(row.state)) {
        stateMap.set(row.state, new Map());
      }
      const countyMap = stateMap.get(row.state)!;

      if (!countyMap.has(row.county)) {
        countyMap.set(row.county, new Map());
      }
      
      // Only process cities if we grouped by them
      if (groupByCity && row.city) {
        const cityMap = countyMap.get(row.county)!;
        cityMap.set(row.city, {
          count: Number(row.count),
          avgSeverity: Number(row.avgSeverity) || 0,
        });
      } else {
        // Store county-level data directly if not grouping by city
        // We use a special key '' to store the aggregate for the county itself
        const cityMap = countyMap.get(row.county)!;
        cityMap.set('', {
          count: Number(row.count),
          avgSeverity: Number(row.avgSeverity) || 0,
        });
      }
    });

    // Convert to TreemapNode structure
    const rootChildren: TreemapNode[] = [];
    let totalAccidents = 0;

    stateMap.forEach((countyMap, stateName) => {
      const stateChildren: TreemapNode[] = [];
      let stateTotal = 0;
      let stateSeveritySum = 0;

      countyMap.forEach((cityMap, countyName) => {
        const countyChildren: TreemapNode[] = [];
        let countyTotal = 0;
        let countySeveritySum = 0;

        cityMap.forEach((data, cityName) => {
          // If we have city data (cityName is not empty), add it as a child
          if (cityName) {
            countyChildren.push({
              name: cityName,
              value: data.count,
              avgSeverity: data.avgSeverity,
            });
          }
          
          // Accumulate totals
          countyTotal += data.count;
          countySeveritySum += data.avgSeverity * data.count;
        });

        // If we have city children, sort and limit them
        if (countyChildren.length > 0) {
          countyChildren.sort((a, b) => b.value - a.value);
        }

        stateChildren.push({
          name: countyName,
          value: countyTotal,
          avgSeverity: countyTotal > 0 ? countySeveritySum / countyTotal : 0,
          children: countyChildren.length > 0 ? countyChildren.slice(0, 20) : undefined,
        });
        stateTotal += countyTotal;
        stateSeveritySum += countySeveritySum;
      });

      // Sort and limit counties
      stateChildren.sort((a, b) => b.value - a.value);

      rootChildren.push({
        name: stateName,
        value: stateTotal,
        avgSeverity: stateTotal > 0 ? stateSeveritySum / stateTotal : 0,
        children: stateChildren.slice(0, 30), // Limit counties per state
      });
      totalAccidents += stateTotal;
    });

    // Sort states by value
    rootChildren.sort((a, b) => b.value - a.value);

    const response = {
      data: {
        name: 'USA',
        value: totalAccidents,
        avgSeverity: 0,
        children: rootChildren,
      },
      totalAccidents,
    };

    this.setCache(cacheKey, response);
    return response;
  }

  // OPTIMIZED: Use parallel queries for POI stacked bar data
  async getStackedBarData(poiType?: string, timeFilters?: QueryParam): Promise<StackedBarData> {
    const cacheKey = `stacked-bar-${poiType || 'all'}-${timeFilters?.year || 'all'}-${timeFilters?.month || 'all'}-${timeFilters?.dayOfWeek || 'all'}-${timeFilters?.timeOfDay || 'all'}`;
    const cached = this.getCached<StackedBarData>(cacheKey);
    if (cached) return cached;

    const poiFields = [
      'junction',
      'trafficSignal',
      'stop',
      'crossing',
      'bump',
    ];

    const targetFields = poiType ? [poiType] : poiFields;

    // Build time filter where clause
    let timeWhereClause = '';
    if (timeFilters?.year) {
      timeWhereClause += ` AND year = ${parseInt(timeFilters.year)}`;
    }
    if (timeFilters?.month) {
      timeWhereClause += ` AND month = ${parseInt(timeFilters.month)}`;
    }
    if (timeFilters?.dayOfWeek) {
      timeWhereClause += ` AND dayOfWeek = '${timeFilters.dayOfWeek.replace(/'/g, "''")}'`;
    }
    if (timeFilters?.timeOfDay === 'day') {
      timeWhereClause += ' AND hour >= 6 AND hour < 18';
    } else if (timeFilters?.timeOfDay === 'night') {
      timeWhereClause += ' AND (hour >= 18 OR hour < 6)';
    }

    // OPTIMIZED: Use single query per POI with GROUP BY instead of two separate queries
    const queries = targetFields.map((field) =>
      this.prismaService.$queryRawUnsafe<{ severity: number; present: number; count: bigint }[]>(
        `SELECT severity, ${field} as present, COUNT(*) as count 
         FROM Accident 
         WHERE 1=1${timeWhereClause} 
         GROUP BY severity, ${field}`,
      ),
    );

    const results = await Promise.all(queries);

    const data: POICategory[] = targetFields.map((field, index) => {
      const rows = results[index];

      const present = { severity1: 0, severity2: 0, severity3: 0, severity4: 0, total: 0 };
      const absent = { severity1: 0, severity2: 0, severity3: 0, severity4: 0, total: 0 };

      rows.forEach((row) => {
        const isPresent = Number(row.present) === 1;
        const target = isPresent ? present : absent;
        const key = `severity${row.severity}` as keyof typeof present;
        
        if (key in target && key !== 'total') {
          target[key] = Number(row.count);
          target.total += Number(row.count);
        }
      });

      const displayName = field
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();

      return { category: displayName, present, absent };
    });

    const response = { data };
    this.setCache(cacheKey, response);
    return response;
  }
}

