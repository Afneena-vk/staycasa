

import { ISubscriptionPlan } from "../models/subscriptionPlan";
import { SubscriptionPlanResponseDto } from "../dtos/subscriptionPlan.dto";

export class SubscriptionPlanMapper {
  static toResponseDto(plan: ISubscriptionPlan): SubscriptionPlanResponseDto {
    return {
      id: plan._id.toString(),
      name: plan.name,
      duration: plan.duration,
      price: plan.price,
      maxProperties: plan.maxProperties,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }

  static toResponseDtoList(plans: ISubscriptionPlan[]): SubscriptionPlanResponseDto[] {
    return plans.map(this.toResponseDto);
  }
}
