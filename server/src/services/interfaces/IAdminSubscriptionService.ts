
import { ISubscriptionPlan } from "../../models/subscriptionPlan";
import { SubscriptionPlanResponseDto, UpdateSubscriptionPlanDto } from "../../dtos/subscriptionPlan.dto";

export interface IAdminSubscriptionService {
  getAllPlans(): Promise<SubscriptionPlanResponseDto[]>;

  updatePlan(
    planId: string,
     data: UpdateSubscriptionPlanDto
  ): Promise<SubscriptionPlanResponseDto | null>;
}
