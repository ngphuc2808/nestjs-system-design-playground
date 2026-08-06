export class ToggleFlagDto {
  flagName: string = 'NEW_CHECKOUT_V2';
  enabled: boolean = true;
  rolloutPercentage: number = 25;
  allowedUserIds?: string[] = [];
}
