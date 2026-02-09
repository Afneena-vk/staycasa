


import { SubscriptionPlanResponseDto } from "../../dtos/subscriptionPlan.dto";
import { CreateSubscriptionDto, CurrentSubscriptionDto } from "../../dtos/subscription.dto";

export interface ISubscriptionService {
  getAllPlans(): Promise<SubscriptionPlanResponseDto[]>;
  subscribe(ownerId: string, data: CreateSubscriptionDto): Promise<void>;
  getCurrentSubscription(ownerId: string): Promise<CurrentSubscriptionDto>;
}
