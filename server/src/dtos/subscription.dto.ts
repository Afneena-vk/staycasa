export interface CreateSubscriptionDto {
  planId: string;
  paymentId: string;
}

export interface SubscriptionResponseDto {
  id: string;
  planName: string;
  startDate: Date;
  endDate: Date;
  status: "Active" | "Expired";
  remainingDays: number;
  maxProperties: number | null;
  usedProperties: number;
  price: number;
}

export interface CurrentSubscriptionDto {
  hasActiveSubscription: boolean;
  subscription: SubscriptionResponseDto | null;
}

export interface RazorpayOrderDto {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}
