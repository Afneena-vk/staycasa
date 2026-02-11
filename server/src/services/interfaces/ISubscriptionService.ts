


import { SubscriptionPlanResponseDto } from "../../dtos/subscriptionPlan.dto";
import { CreateSubscriptionDto, CurrentSubscriptionDto, RazorpayOrderDto, AdminSubscriptionDto, AdminSubscriptionFilterDto, AdminSubscriptionListResponseDto } from "../../dtos/subscription.dto";

export interface ISubscriptionService {
  getAllPlans(): Promise<SubscriptionPlanResponseDto[]>;
  subscribe(ownerId: string, data: CreateSubscriptionDto): Promise<void>;
  getCurrentSubscription(ownerId: string): Promise<CurrentSubscriptionDto>;
  createSubscriptionOrder(ownerId: string, planId: string): Promise<RazorpayOrderDto>;
  verifySubscriptionPayment(
    ownerId: string,
    planId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string
  ): Promise<void>;

  // getAllSubscriptions(filters: AdminSubscriptionFilterDto
  // ): Promise<{
  //   data: AdminSubscriptionDto[];
  //   pagination: {
  //     total: number;
  //     page: number;
  //     limit: number;
  //     totalPages: number;
  //   };
  // }> 

 getAllSubscriptions(
  filters: AdminSubscriptionFilterDto
): Promise<AdminSubscriptionListResponseDto> 

}
