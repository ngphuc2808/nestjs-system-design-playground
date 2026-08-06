export class KeysetPaginationDto {
  cursor?: number = 0;
  limit?: number = 20;
  status?: string;
  minAge?: number;
  maxAge?: number;
}
