
import { injectable } from "tsyringe";
import { BaseRepository } from "./baseRepository";
import SubscriptionPlan,{ ISubscriptionPlan } from "../models/subscriptionPlan";
import { ISubscriptionPlanRepository } from "./interfaces/ISubscriptionPlanRepository";

@injectable()
export class SubscriptionPlanRepository extends BaseRepository<ISubscriptionPlan> implements ISubscriptionPlanRepository {
  constructor() {
    super(SubscriptionPlan);
  }
}
