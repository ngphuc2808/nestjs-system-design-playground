export class TransferTransactionDto {
  accountId: string = 'ACC_1001';
  amount: number = 250.0;
  type: 'CREDIT' | 'DEBIT' = 'CREDIT';
}
