
import { IBaseRepository } from "./IBaseRepository";
import { ISubscription } from "../../models/subscription";
import { AdminSubscriptionFilterDto } from "../../dtos/subscription.dto";
import { IAdminSubscriptionAggregate } from "../../dtos/adminSubscriptionAggregate";

export interface ISubscriptionRepository extends IBaseRepository<ISubscription> {

findActiveByOwnerId(ownerId: string): Promise<ISubscription | null>;
expireExpiredSubscriptions(): Promise<void>;

// getAllSubscriptions(filters: AdminSubscriptionFilterDto): Promise<{ data: ISubscription[]; total: number }>;
getAllSubscriptions(filters: AdminSubscriptionFilterDto
// ): Promise<{ data: IAdminSubscriptionAggregate[]; total: number }>;
): Promise<{
  data: IAdminSubscriptionAggregate[];
  total: number;
  totalRevenue: number;
}>
}
