export class EvaluateFeatureDto {
  flagName: string = 'NEW_CHECKOUT_V2';
  userId: string = 'USER_5521';
  payload?: Record<string, any> = { cartTotal: 199.99 };
}
