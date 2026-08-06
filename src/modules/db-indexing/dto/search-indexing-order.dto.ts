export class SearchIndexingOrderDto {
  status?: string = 'PENDING';
  userId?: number;
  category?: string = 'ELECTRONICS';
  createdAfter?: string = '2026-08-01';
}
