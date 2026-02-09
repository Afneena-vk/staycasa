
import { IBaseRepository } from "./IBaseRepository";
import { ISubscription } from "../../models/subscription";

export interface ISubscriptionRepository extends IBaseRepository<ISubscription> {

  //createSubscription(data: Partial<ISubscription>): Promise<ISubscription> 

  //findSubscriptionsByOwner(ownerId: string): Promise<ISubscription[]>;
findActiveByOwnerId(ownerId: string): Promise<ISubscription | null>;
expireExpiredSubscriptions(): Promise<void>;

}
