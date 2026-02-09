

export interface SubscriptionPlanDto {
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

export interface CurrentSubscriptionDto {
  hasActiveSubscription: boolean;
  subscription: {
    id: string;
    planName: string;
    startDate: string;
    endDate: string;
    status: "Active" | "Expired";
    remainingDays: number;
    maxProperties: number | null;
    usedProperties: number;
    price: number;
  } | null;
}

