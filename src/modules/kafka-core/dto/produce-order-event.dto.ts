export class ProduceOrderEventDto {
  orderId: string = 'ORD_9901';
  eventType: 'ORDER_CREATED' | 'ORDER_PAID' | 'ORDER_SHIPPED' | 'ORDER_CANCELLED' = 'ORDER_CREATED';
  amount?: number = 299.99;
}
