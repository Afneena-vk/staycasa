
import { injectable } from "tsyringe";
import { BaseRepository } from "./baseRepository";
import Subscription, {ISubscription} from "../models/subscription";
import { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository";
import { AdminSubscriptionFilterDto } from "../dtos/subscription.dto";
import { IAdminSubscriptionAggregate } from "../dtos/adminSubscriptionAggregate";


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

//   async getAllSubscriptions(
//     filters: AdminSubscriptionFilterDto
//   ): Promise<{ data: ISubscription[]; total: number }> {

//       const { page = 1, limit = 10 } = filters;

//       const query: any = {};

//   if (filters.status) query.status = filters.status;

//   if (filters.startDate || filters.endDate) {
//     query.startDate = {};
//     if (filters.startDate) query.startDate.$gte = filters.startDate;
//     if (filters.endDate) query.startDate.$lte = filters.endDate;
//   }

//   let subscriptionsQuery = this.model.find(query)
//     .populate("ownerId", "name email")      // only fetch name & email
//     .populate("planId", "name price duration maxProperties")
//     // .sort({ startDate: -1 });

//   // If filtering by ownerName or planName
//   if (filters.ownerName || filters.planName) {
//     subscriptionsQuery = subscriptionsQuery.where({
//       ...(filters.ownerName && { "ownerId.name": new RegExp(filters.ownerName, "i") }),
//       ...(filters.planName && { "planId.name": new RegExp(filters.planName, "i") }),
//     });
//   }

// //   return await subscriptionsQuery.exec();

//  const total = await this.model.countDocuments(query);

//   const data = await subscriptionsQuery
//     .sort({ startDate: -1 })
//     .skip((page - 1) * limit)
//     .limit(limit)
//     .exec();

//   return { data, total };

// }

// async getAllSubscriptions(
//   filters: AdminSubscriptionFilterDto
// ): Promise<{ data: ISubscription[]; total: number }> {
//   const { page = 1, limit = 10, status } = filters;

//   const query: any = {};
//   if (status) query.status = status;

//   const [data, total] = await Promise.all([
//     this.model
//       .find(query)
//       .populate("ownerId", "name email")
//       .populate("planId", "name price duration maxProperties")
//       .sort({ startDate: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit),

//     this.model.countDocuments(query),
//   ]);

//   return { data, total };
// }


async getAllSubscriptions(
  filters: AdminSubscriptionFilterDto

// ): Promise<{ data: IAdminSubscriptionAggregate[]; total: number }> {
): Promise<{
  data: IAdminSubscriptionAggregate[];
  total: number;
  totalRevenue: number;
}> {
  const { page = 1, limit = 10, ownerName, planName, status, startDate, endDate } = filters;

  const matchStage: any = {};

  if (status) matchStage.status = status;

  if (startDate || endDate) {
    matchStage.startDate = {};
    if (startDate) matchStage.startDate.$gte = startDate;
    if (endDate) matchStage.startDate.$lte = endDate;
  }

  // const pipeline: any[] = [
  const basePipeline: any[] = [
    { $match: matchStage },

    
    {
      $lookup: {
        from: "owners",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },

    
    {
      $lookup: {
        from: "subscriptionplans",
        localField: "planId",
        foreignField: "_id",
        as: "plan",
      },
    },
    { $unwind: "$plan" },
  ];

  
  if (ownerName) {
    // pipeline.push({
     basePipeline.push({
      $match: { "owner.name": { $regex: ownerName, $options: "i" } },
    });
  }

  if (planName) {
    // pipeline.push({
    basePipeline.push({
      $match: { "plan.name": { $regex: planName, $options: "i" } },
    });
  }


  //const countPipeline = [...pipeline, { $count: "total" }];
  const countPipeline = [...basePipeline, { $count: "total" }];

    const revenuePipeline = [
    ...basePipeline,
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$plan.price" },
      },
    },
  ];

 
  // pipeline.push(
  //   { $sort: { startDate: -1 } },
  //   { $skip: (page - 1) * limit },
  //   { $limit: limit }
  // );

    const dataPipeline = [
    ...basePipeline,
    { $sort: { startDate: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  // const [rows, countResult] = await Promise.all([
  //   this.model.aggregate(pipeline),
  //   this.model.aggregate(countPipeline),
  // ]);
    const [rows, countResult, revenueResult] = await Promise.all([
    this.model.aggregate(dataPipeline),
    this.model.aggregate(countPipeline),
    this.model.aggregate(revenuePipeline),
  ]);

  const total = countResult[0]?.total || 0;

  return {
    // data: rows as ISubscription[],
    data: rows as IAdminSubscriptionAggregate[],
    total,
    totalRevenue: revenueResult[0]?.totalRevenue || 0,
  };
}


}
