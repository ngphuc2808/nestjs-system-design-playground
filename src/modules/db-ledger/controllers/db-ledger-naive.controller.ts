import { Body, Controller, Post } from '@nestjs/common';
import { DbLedgerNaiveService } from '../services/db-ledger-naive.service';
import { TransferTransactionDto } from '../dto/transfer-transaction.dto';

@Controller('api/v1/db-ledger/naive')
export class DbLedgerNaiveController {
  constructor(private readonly naiveService: DbLedgerNaiveService) {}

  @Post('transfer')
  transferNaive(@Body() dto: TransferTransactionDto) {
    return this.naiveService.transferNaive(dto);
  }
}
