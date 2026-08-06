import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DbPaginationOptimizedService } from '../services/db-pagination-optimized.service';
import { OffsetPaginationDto } from '../dto/offset-pagination.dto';
import { KeysetPaginationDto } from '../dto/keyset-pagination.dto';
import { SeedUsersDto } from '../dto/seed-users.dto';

@Controller('api/v1/db-pagination')
export class DbPaginationOptimizedController {
  constructor(private readonly optimizedService: DbPaginationOptimizedService) {}

  @Get('optimized/users/deferred-join')
  getDeferredJoinUsers(@Query() dto: OffsetPaginationDto) {
    return this.optimizedService.getDeferredJoinUsers(dto);
  }

  @Get('optimized/users/keyset')
  getKeysetUsers(@Query() dto: KeysetPaginationDto) {
    return this.optimizedService.getKeysetUsers(dto);
  }

  @Get('optimized/users/page-map')
  getPrecomputedPageMapUsers(@Query() dto: OffsetPaginationDto) {
    return this.optimizedService.getPrecomputedPageMapUsers(dto);
  }

  @Post('optimized/users/page-map/refresh')
  refreshPageMap(@Query('limit') limit?: number) {
    return this.optimizedService.refreshPageMap(Number(limit) || 20);
  }

  @Post('seed')
  seedUsers(@Body() dto: SeedUsersDto) {
    return this.optimizedService.seedUsers(dto);
  }
}
