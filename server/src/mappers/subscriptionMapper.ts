import { ISubscription } from "../models/subscription";
import { ISubscriptionPlan } from "../models/subscriptionPlan";
import { SubscriptionResponseDto } from "../dtos/subscription.dto";

export class SubscriptionMapper {
  static toResponseDto(
    subscription: ISubscription, 
    usedProperties: number
  ): SubscriptionResponseDto {
    const plan = subscription.planId as ISubscriptionPlan;
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      id: subscription._id.toString(),
      planName: plan.name,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
      remainingDays,
      maxProperties: plan.maxProperties,
      usedProperties,
      price: plan.price,
    };
  }
}