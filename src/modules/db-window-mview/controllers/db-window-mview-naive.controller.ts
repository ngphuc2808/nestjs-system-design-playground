import { Controller, Get, Query } from '@nestjs/common';
import { DbWindowMviewNaiveService } from '../services/db-window-mview-naive.service';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto';

@Controller('api/v1/db-window-mview/naive')
export class DbWindowMviewNaiveController {
  constructor(private readonly naiveService: DbWindowMviewNaiveService) {}

  @Get('analytics')
  getAnalyticsNaive(@Query() dto: AnalyticsQueryDto) {
    return this.naiveService.getAnalyticsNaive(dto);
  }
}
