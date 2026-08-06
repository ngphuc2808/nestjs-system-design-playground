import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DbLedgerOptimizedService } from '../services/db-ledger-optimized.service';
import { TransferTransactionDto } from '../dto/transfer-transaction.dto';
import { TamperLedgerDto } from '../dto/tamper-ledger.dto';

@Controller('api/v1/db-ledger/optimized')
export class DbLedgerOptimizedController {
  constructor(private readonly optimizedService: DbLedgerOptimizedService) {}

  @Post('transfer')
  transferOptimized(@Body() dto: TransferTransactionDto) {
    return this.optimizedService.transferOptimized(dto);
  }

  @Get('verify')
  verifyIntegrity() {
    return this.optimizedService.verifyIntegrity();
  }

  @Get('transactions')
  getTransactions(@Query('accountId') accountId?: string) {
    return this.optimizedService.getTransactions(accountId);
  }

  @Post('simulate-tampering')
  simulateTampering(@Body() dto: TamperLedgerDto) {
    return this.optimizedService.simulateTampering(dto);
  }
}
