export class OffsetPaginationDto {
  page?: number = 1;
  limit?: number = 20;
  status?: string;
  minAge?: number;
  maxAge?: number;
}
