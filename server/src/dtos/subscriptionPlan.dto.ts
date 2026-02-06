


export interface SubscriptionPlanResponseDto {
  id: string;
  name: string;
  duration: string;
  price: number;
  maxProperties: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSubscriptionPlanDto {
  price?: number;
  duration?: string;
  maxProperties?: number | null;
}
