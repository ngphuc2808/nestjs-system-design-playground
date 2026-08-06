import { Controller, Get, Post, Query } from '@nestjs/common';
import { DbWindowMviewOptimizedService } from '../services/db-window-mview-optimized.service';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto';

@Controller('api/v1/db-window-mview/optimized')
export class DbWindowMviewOptimizedController {
  constructor(private readonly optimizedService: DbWindowMviewOptimizedService) {}

  @Get('analytics/window')
  getWindowAnalyticsOptimized(@Query() dto: AnalyticsQueryDto) {
    return this.optimizedService.getWindowAnalyticsOptimized(dto);
  }

  @Get('analytics/mview')
  getMaterializedViewAnalyticsOptimized(@Query() dto: AnalyticsQueryDto) {
    return this.optimizedService.getMaterializedViewAnalyticsOptimized(dto);
  }

  @Post('mview/refresh')
  refreshMaterializedViewConcurrently() {
    return this.optimizedService.refreshMaterializedViewConcurrently();
  }
}
