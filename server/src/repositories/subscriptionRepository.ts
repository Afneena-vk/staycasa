
import { injectable } from "tsyringe";
import { BaseRepository } from "./baseRepository";
import Subscription, {ISubscription} from "../models/subscription";
import { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository";


@injectable()
export class SubscriptionRepository extends BaseRepository<ISubscription> implements ISubscriptionRepository {
  constructor() {
    super(Subscription);
  }

async findActiveByOwnerId(ownerId: string): Promise<ISubscription | null> {
    return await this.model.findOne({ 
      ownerId, 
      status: "Active",
      endDate: { $gte: new Date() }
    }).populate('planId').exec();
  }

 async expireExpiredSubscriptions(): Promise<void> {
    await this.model.updateMany(
      {
        status: "Active",
        endDate: { $lt: new Date() },
      },
      {
        $set: { status: "Expired" },
      }
    );
  }

}
