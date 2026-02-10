


import { SubscriptionPlanResponseDto } from "../../dtos/subscriptionPlan.dto";
import { CreateSubscriptionDto, CurrentSubscriptionDto, RazorpayOrderDto } from "../../dtos/subscription.dto";

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
}
