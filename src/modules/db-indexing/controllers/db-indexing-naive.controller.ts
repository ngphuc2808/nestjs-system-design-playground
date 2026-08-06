import { Controller, Get, Query } from '@nestjs/common';
import { DbIndexingNaiveService } from '../services/db-indexing-naive.service';
import { SearchIndexingOrderDto } from '../dto/search-indexing-order.dto';

@Controller('api/v1/db-indexing/naive')
export class DbIndexingNaiveController {
  constructor(private readonly naiveService: DbIndexingNaiveService) {}

  @Get('leftmost')
  getLeftmostNaive(@Query() dto: SearchIndexingOrderDto) {
    return this.naiveService.getLeftmostNaive(dto);
  }

  @Get('gin-jsonb')
  getGinJsonbNaive(@Query() dto: SearchIndexingOrderDto) {
    return this.naiveService.getGinJsonbNaive(dto);
  }
}
