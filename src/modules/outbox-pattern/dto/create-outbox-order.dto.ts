export class CreateOutboxOrderDto {
  amount: number = 349.50;
  customerId: string = 'CUST_7712';
  simulateBrokerFailure?: boolean = false;
}
