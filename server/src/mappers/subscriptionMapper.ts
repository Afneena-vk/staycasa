import { ISubscription } from "../models/subscription";
import { ISubscriptionPlan } from "../models/subscriptionPlan";
import { SubscriptionResponseDto,  AdminSubscriptionDto } from "../dtos/subscription.dto";
import { IOwner } from "../models/ownerModel";
import { IAdminSubscriptionAggregate } from "../dtos/adminSubscriptionAggregate";

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


// static toDto(subscription: ISubscription): AdminSubscriptionDto {
static toDto(subscription: IAdminSubscriptionAggregate): AdminSubscriptionDto {
    // const owner = subscription.ownerId as IOwner;
    // const plan = subscription.planId as ISubscriptionPlan;
  const owner = subscription.owner;
  const plan = subscription.plan;

    return {
      id: subscription._id.toString(),
      owner: {
        id: owner._id.toString(),
        name: owner.name,
        email: owner.email,
      },
      plan: {
        id: plan._id.toString(),
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        maxProperties: plan.maxProperties,
      },
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      paymentId: subscription.paymentId,
      transactionType: subscription.transactionType,
    };
  }

//   static toDtoList(subscriptions: ISubscription[]): AdminSubscriptionDto[] {
static toDtoList(subscriptions: IAdminSubscriptionAggregate[]): AdminSubscriptionDto[] {
    return subscriptions.map(this.toDto);
  }  


  static toAdminDto(subscription: ISubscription): AdminSubscriptionDto {
    const owner = subscription.ownerId as unknown as IOwner;
    const plan = subscription.planId as unknown as ISubscriptionPlan;

    return {
      id: subscription._id.toString(),
      owner: {
        id: owner._id.toString(),
        name: owner.name,
        email: owner.email,
      },
      plan: {
        id: plan._id.toString(),
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        maxProperties: plan.maxProperties,
      },
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      paymentId: subscription.paymentId,
      transactionType: subscription.transactionType,
    };
  }

  static toAdminDtoList(subscriptions: ISubscription[]): AdminSubscriptionDto[] {
    return subscriptions.map((sub) => this.toAdminDto(sub));
  }

}