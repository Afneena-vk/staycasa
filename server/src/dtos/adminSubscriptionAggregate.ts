import { ISubscription } from "../models/subscription";
import { IOwner } from "../models/ownerModel";
import { ISubscriptionPlan } from "../models/subscriptionPlan";

export interface IAdminSubscriptionAggregate
  extends Omit<ISubscription, "ownerId" | "planId"> {
  owner: IOwner;
  plan: ISubscriptionPlan;
}