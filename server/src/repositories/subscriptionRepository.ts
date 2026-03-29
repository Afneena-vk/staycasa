
import { injectable } from "tsyringe";
import { BaseRepository } from "./baseRepository";
import Subscription, {ISubscription} from "../models/subscription";
import { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository";
import { AdminSubscriptionFilterDto } from "../dtos/subscription.dto";
import { IAdminSubscriptionAggregate } from "../dtos/adminSubscriptionAggregate";
import { CreateSubscriptionInput } from "./interfaces/ISubscriptionRepository";
import { Types } from "mongoose";
import { PipelineStage, FilterQuery } from "mongoose";

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




async getAllSubscriptions(
  filters: AdminSubscriptionFilterDto

// ): Promise<{ data: IAdminSubscriptionAggregate[]; total: number }> {
): Promise<{
  data: IAdminSubscriptionAggregate[];
  total: number;
  totalRevenue: number;
}> {
  const { page = 1, limit = 10, ownerName, planName, status, startDate, endDate } = filters;

 
   const matchStage: FilterQuery<ISubscription> = {};

  if (status) matchStage.status = status;

  if (startDate || endDate) {
    matchStage.startDate = {};
    if (startDate) matchStage.startDate.$gte = startDate;
    if (endDate) matchStage.startDate.$lte = endDate;
  }


    const basePipeline: PipelineStage[] = [
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
  //const countPipeline = [...basePipeline, { $count: "total" }];
  const countPipeline: PipelineStage[] = [
  ...basePipeline,
  { $count: "total" },
];

    //const revenuePipeline = [
    const revenuePipeline: PipelineStage[] = [
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

   // const dataPipeline = [
   const dataPipeline: PipelineStage[] = [
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


async getTotalRevenue(): Promise<number> {
 // const result = await this.model.aggregate([
   const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: "subscriptionplans",
        localField: "planId",
        foreignField: "_id",
        as: "plan",
      },
    },
    { $unwind: "$plan" },
    {
      $project: {
        amount: {
          $cond: [
            { $eq: ["$transactionType", "Upgrade"] },
            { $ifNull: ["$proratedAmount", 0] },
            { $ifNull: ["$originalAmount", "$plan.price"] }
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ]
  const result = await this.model.aggregate(pipeline);
//);

  return result[0]?.total || 0;
}

async getMonthlyRevenue(year?: number): Promise<{ month: string; revenue: number }[]> {

    const match: FilterQuery<ISubscription> = {};

  if (year) {
    match.createdAt = {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`)
    };
  }

  // return this.model.aggregate([

  const pipeline: PipelineStage[] = [
    { $match: match },
    {
      $lookup: {
        from: "subscriptionplans",
        localField: "planId",
        foreignField: "_id",
        as: "plan",
      },
    },
    { $unwind: "$plan" },
    {
      $project: {
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
        amount: {
          $cond: [
            { $eq: ["$transactionType", "Upgrade"] },
            { $ifNull: ["$proratedAmount", 0] },
            { $ifNull: ["$originalAmount", "$plan.price"] }
          ]
        }
      }
    },
    {
      $group: {
        _id: { year: "$year", month: "$month" },
        revenue: { $sum: "$amount" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            { $toString: "$_id.month" }
          ]
        },
        revenue: 1
      }
    }
  ]

  return this.model.aggregate(pipeline);
//);
}


async createSubscription(data: CreateSubscriptionInput): Promise<ISubscription> {
  return await this.model.create({
    ownerId: new Types.ObjectId(data.ownerId),
    planId: new Types.ObjectId(data.planId),
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status,
    paymentId: data.paymentId,
    isUpgrade: data.isUpgrade,
    transactionType: data.transactionType,
    originalAmount: data.originalAmount,
    proratedAmount: data.proratedAmount,
    upgradedFrom: data.upgradedFrom,
  });
}

}
