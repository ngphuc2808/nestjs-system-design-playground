import { Controller, Get, Query } from '@nestjs/common';
import { DbSargableOptimizedService } from '../services/db-sargable-optimized.service';
import { SearchDateDto } from '../dto/search-date.dto';
import { SearchUserDto } from '../dto/search-user.dto';

@Controller('api/v1/db-sargable/optimized')
export class DbSargableOptimizedController {
  constructor(private readonly optimizedService: DbSargableOptimizedService) {}

  @Get('date-range')
  searchDateRangeOptimized(@Query() dto: SearchDateDto) {
    return this.optimizedService.searchDateRangeOptimized(dto);
  }

  @Get('parameter-binding')
  searchUserParameterBindingOptimized(@Query() dto: SearchUserDto) {
    return this.optimizedService.searchUserParameterBindingOptimized(dto);
  }
}
