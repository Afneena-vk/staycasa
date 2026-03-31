


import { SubscriptionPlanResponseDto } from "../../dtos/subscriptionPlan.dto";
import { CreateSubscriptionDto, CurrentSubscriptionDto, RazorpayOrderDto, AdminSubscriptionDto, AdminSubscriptionFilterDto, AdminSubscriptionListResponseDto, UpgradeOrderResponseDto } from "../../dtos/subscription.dto";

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


 getAllSubscriptions(
  filters: AdminSubscriptionFilterDto
): Promise<AdminSubscriptionListResponseDto> 

createUpgradeOrder(ownerId: string, newPlanId: string): Promise<UpgradeOrderResponseDto>;
verifyUpgradePayment(
  ownerId: string,
  newPlanId: string,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
): Promise<void>;

}
