

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

export interface AdminSubscriptionFilterDto {
  ownerName?: string;
  planName?: string;
  status?: "Active" | "Expired";
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface AdminSubscriptionListResponseDto {
  data: AdminSubscriptionDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  revenue: number;
}


