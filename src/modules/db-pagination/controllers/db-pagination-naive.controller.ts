import { Controller, Get, Query } from '@nestjs/common';
import { DbPaginationNaiveService } from '../services/db-pagination-naive.service';
import { OffsetPaginationDto } from '../dto/offset-pagination.dto';

@Controller('api/v1/db-pagination/naive')
export class DbPaginationNaiveController {
  constructor(private readonly naiveService: DbPaginationNaiveService) {}

  @Get('users')
  getNaiveOffsetUsers(@Query() dto: OffsetPaginationDto) {
    return this.naiveService.getNaiveOffsetUsers(dto);
  }
}
