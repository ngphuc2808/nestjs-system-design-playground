export class RateLimitQueryDto {
  identifier?: string = 'user_user101';
  limit?: number = 10;
  windowSeconds?: number = 60;
}
