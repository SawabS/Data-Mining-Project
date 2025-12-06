import { Controller, Get, Query } from '@nestjs/common';
import {
  AccidentService,
  TemporalHeatmapData,
  HexbinMapData,
  ParallelCoordinatesData,
  TreemapData,
  StackedBarData,
} from './accident.service';
import { Pagination, Queries } from 'lib/functions';
import { PaginationParams, PaginationType, QueryParam } from 'src/types/global';
import { Accident } from '@prisma/client';

@Controller('accident')
export class AccidentController {
  constructor(private readonly accidentService: AccidentService) {}

  @Get('')
  async get(
    @Pagination() pagination: PaginationParams,
    @Queries() query: QueryParam,
  ): Promise<PaginationType<Partial<Accident>>> {
    return await this.accidentService.get(pagination, query);
  }

  @Get('temporal-heatmap')
  async getTemporalHeatmap(
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
    @Query('timeOfDay') timeOfDay?: 'day' | 'night' | 'all',
  ): Promise<TemporalHeatmapData> {
    return await this.accidentService.getTemporalHeatmap({ 
      city, 
      state,
      year,
      month,
      dayOfWeek,
      timeOfDay,
    } as QueryParam);
  }

  @Get('filter-options')
  async getFilterOptions(): Promise<{ cities: string[]; states: string[] }> {
    return await this.accidentService.getFilterOptions();
  }

  // Task 1: Hexbin Map Data
  @Get('hexbin-map')
  async getHexbinMapData(
    @Query('state') state?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
    @Query('timeOfDay') timeOfDay?: 'day' | 'night' | 'all',
  ): Promise<HexbinMapData> {
    return await this.accidentService.getHexbinMapData({ 
      state,
      year,
      month,
      dayOfWeek,
      timeOfDay,
    } as QueryParam);
  }

  // Task 3: Parallel Coordinates Data
  @Get('parallel-coordinates')
  async getParallelCoordinatesData(
    @Query('severity') severity?: string,
    @Query('limit') limit?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
    @Query('timeOfDay') timeOfDay?: 'day' | 'night' | 'all',
  ): Promise<ParallelCoordinatesData> {
    return await this.accidentService.getParallelCoordinatesData(
      severity ? parseInt(severity) : undefined,
      limit ? parseInt(limit) : 5000,
      { year, month, dayOfWeek, timeOfDay } as QueryParam,
    );
  }

  // Task 4: Treemap Data
  @Get('treemap')
  async getTreemapData(
    @Query('state') state?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
    @Query('timeOfDay') timeOfDay?: 'day' | 'night' | 'all',
  ): Promise<TreemapData> {
    return await this.accidentService.getTreemapData(state, { year, month, dayOfWeek, timeOfDay } as QueryParam);
  }

  // Task 5: Stacked Bar Data
  @Get('stacked-bar')
  async getStackedBarData(
    @Query('poiType') poiType?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
    @Query('timeOfDay') timeOfDay?: 'day' | 'night' | 'all',
  ): Promise<StackedBarData> {
    return await this.accidentService.getStackedBarData(poiType, { year, month, dayOfWeek, timeOfDay } as QueryParam);
  }
}
