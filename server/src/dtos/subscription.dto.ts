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



export interface AdminSubscriptionFilterDto {
  ownerName?: string;
  planName?: string;
  status?: "Active" | "Expired";
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}



export interface AdminSubscriptionDto {
  id: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    duration: string;
    maxProperties: number | null;
  };
  status: "Active" | "Expired";
  startDate: Date;
  endDate: Date;
  paymentId?: string;
  transactionType: "New" | "Renewal" | "Upgrade";
}

