import { Controller, Get, Query } from '@nestjs/common';
import { DbSargableNaiveService } from '../services/db-sargable-naive.service';
import { SearchDateDto } from '../dto/search-date.dto';
import { SearchUserDto } from '../dto/search-user.dto';

@Controller('api/v1/db-sargable/naive')
export class DbSargableNaiveController {
  constructor(private readonly naiveService: DbSargableNaiveService) {}

  @Get('date-search')
  searchDateNaive(@Query() dto: SearchDateDto) {
    return this.naiveService.searchDateNaive(dto);
  }

  @Get('raw-string')
  searchUserRawStringNaive(@Query() dto: SearchUserDto) {
    return this.naiveService.searchUserRawStringNaive(dto);
  }
}
