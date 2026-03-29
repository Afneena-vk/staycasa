

import { injectable, inject } from "tsyringe";
import { TOKENS } from "../config/tokens";
import { ISubscriptionPlanRepository } from "../repositories/interfaces/ISubscriptionPlanRepository";
import { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { IPropertyRepository } from "../repositories/interfaces/IPropertyRepository";
import { ISubscriptionService } from "./interfaces/ISubscriptionService";
import { SubscriptionPlanMapper } from "../mappers/subscriptionPlanMapper";
import { SubscriptionMapper} from "../mappers/subscriptionMapper";
import { AdminSubscriptionListResponseDto, UpgradeOrderResponseDto } from "../dtos/subscription.dto";
import { ISubscriptionPlan } from "../models/subscriptionPlan";

import { AppError } from "../utils/AppError";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import {
  CreateSubscriptionDto,
  CurrentSubscriptionDto,
  RazorpayOrderDto,
  AdminSubscriptionDto,
  AdminSubscriptionFilterDto
} from "../dtos/subscription.dto";
import { SubscriptionPlanResponseDto } from "../dtos/subscriptionPlan.dto";
import Razorpay from "razorpay";
import crypto from "crypto";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TOKENS.ISubscriptionPlanRepository)
    private _subscriptionPlanRepository: ISubscriptionPlanRepository,

    @inject(TOKENS.ISubscriptionRepository)
    private _subscriptionRepository: ISubscriptionRepository,

    @inject(TOKENS.IOwnerRepository)
    private _ownerRepository: IOwnerRepository,

    @inject(TOKENS.IPropertyRepository)
    private _propertyRepository: IPropertyRepository,
  ) {}

  async getAllPlans(): Promise<SubscriptionPlanResponseDto[]> {
    const plans = await this._subscriptionPlanRepository.findAll();
    return SubscriptionPlanMapper.toResponseDtoList(plans);
  }



async createSubscriptionOrder(ownerId: string, planId: string): Promise<RazorpayOrderDto> {
  try {
    console.log(" Creating subscription order");
    console.log("Owner ID:", ownerId);
    console.log("Plan ID:", planId);
    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

    const owner = await this._ownerRepository.findById(ownerId);
    if (!owner) throw new AppError("Owner not found", STATUS_CODES.NOT_FOUND);

    if (owner.approvalStatus !== "approved") {
      throw new AppError("Owner must be approved to subscribe", STATUS_CODES.FORBIDDEN);
    }

    const existingSubscription =
      await this._subscriptionRepository.findActiveByOwnerId(ownerId);

    if (existingSubscription) {
      throw new AppError("You already have an active subscription", STATUS_CODES.CONFLICT);
    }

    const plan = await this._subscriptionPlanRepository.findById(planId);
    if (!plan) throw new AppError("Plan not found", STATUS_CODES.NOT_FOUND);

    console.log(" Plan price:", plan.price);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: plan.price * 100,
      currency: "INR",
      receipt: `sub_${ownerId.slice(-6)}_${Date.now()}`,
    });

    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      receipt: order.receipt!,
    };
      } catch (err: unknown) {  
    if (err instanceof Error) {
      console.error(err.message);
      console.error(err.stack);
    }
    throw err;
  }
}





async verifySubscriptionPayment(
  ownerId: string,
  planId: string,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
): Promise<void> {

  const body = razorpayOrderId + "|" + razorpayPaymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new AppError("Payment verification failed", STATUS_CODES.BAD_REQUEST);
  }

  await this.subscribe(ownerId, {
    planId,
    paymentId: razorpayPaymentId,
  });
}





  async subscribe(ownerId: string, data: CreateSubscriptionDto): Promise<void> {

     await this._subscriptionRepository.expireExpiredSubscriptions();
     
    
    const owner = await this._ownerRepository.findById(ownerId);
    if (!owner) {
      throw new AppError(
        MESSAGES.ERROR.VENDOR_NOT_FOUND,
        STATUS_CODES.NOT_FOUND,
      );
    }

    if (owner.approvalStatus !== "approved") {
      throw new AppError(
        "Owner must be approved to subscribe",
        STATUS_CODES.FORBIDDEN,
      );
    }


    const plan = await this._subscriptionPlanRepository.findById(data.planId);
    if (!plan) {
      throw new AppError(MESSAGES.ERROR.PLAN_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    
    const existingSubscription =
      await this._subscriptionRepository.findActiveByOwnerId(ownerId);
    if (existingSubscription) {
      throw new AppError(
        "You already have an active subscription",
        STATUS_CODES.CONFLICT,
      );
    }

    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); 


    await this._subscriptionRepository.createSubscription({
  ownerId,
  planId: data.planId,
  startDate,
  endDate,
  status: "Active",
  paymentId: data.paymentId,
  isUpgrade: false,
  transactionType: "New",
  originalAmount: plan.price,
});
  }

  async getCurrentSubscription(ownerId: string): Promise<CurrentSubscriptionDto> {

      await this._subscriptionRepository.expireExpiredSubscriptions();

      const subscription = await this._subscriptionRepository.findActiveByOwnerId(ownerId);

      if (!subscription) {
        return {
          hasActiveSubscription: false,
          subscription: null,
        };
      }

     
      const usedProperties = await this._propertyRepository.countByOwnerId(ownerId);

      return {
        hasActiveSubscription: true,
        subscription: SubscriptionMapper.toResponseDto(subscription, usedProperties),
      };
    }



async getAllSubscriptions(filters: AdminSubscriptionFilterDto

// ): Promise<{
//   data: AdminSubscriptionDto[];
//   pagination: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }>
): Promise<AdminSubscriptionListResponseDto> {
 {
//   const subs = await this._subscriptionRepository.getAllSubscriptions(filters);
//   return SubscriptionMapper.toDtoList(subs);

  const { page = 1, limit = 10 } = filters;

  // const { data, total } = await this._subscriptionRepository.getAllSubscriptions(filters);
    const { data, total, totalRevenue } =
    await this._subscriptionRepository.getAllSubscriptions(filters);

  return {
    data: SubscriptionMapper.toDtoList(data),
    revenue: totalRevenue,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };


}


}

async createUpgradeOrder(ownerId: string, newPlanId: string): Promise<UpgradeOrderResponseDto> {
  const owner = await this._ownerRepository.findById(ownerId);
  if (!owner) throw new AppError("Owner not found", STATUS_CODES.NOT_FOUND);

  const currentSubscription = await this._subscriptionRepository.findActiveByOwnerId(ownerId);
  if (!currentSubscription) {
    throw new AppError("No active subscription found to upgrade", STATUS_CODES.BAD_REQUEST);
  }

  const currentPlan = currentSubscription.planId as ISubscriptionPlan;

  const newPlan = await this._subscriptionPlanRepository.findById(newPlanId);
  if (!newPlan) throw new AppError("Plan not found", STATUS_CODES.NOT_FOUND);

  if (newPlan.price <= currentPlan.price) {
    throw new AppError(
      "Upgrade is only allowed to a higher-priced plan",
      STATUS_CODES.BAD_REQUEST
    );
  }

  const now = new Date();
  const endDate = new Date(currentSubscription.endDate);
  const startDate = new Date(currentSubscription.startDate);

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const credit = (remainingDays / totalDays) * currentPlan.price;
  const proratedAmount = Math.max(0, Math.round(newPlan.price - credit));

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const order = await razorpay.orders.create({
    amount: proratedAmount * 100,
    currency: "INR",
    receipt: `upg_${ownerId.slice(-6)}_${Date.now()}`,
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    receipt: order.receipt!,
    proratedAmount,
    currentPlan: currentPlan.name,
    newPlan: newPlan.name,
  };
}

async verifyUpgradePayment(
  ownerId: string,
  newPlanId: string,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
): Promise<void> {
  const body = razorpayOrderId + "|" + razorpayPaymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new AppError("Payment verification failed", STATUS_CODES.BAD_REQUEST);
  }

  await this._processUpgrade(ownerId, newPlanId, razorpayPaymentId);
}

private async _processUpgrade(ownerId: string, newPlanId: string, paymentId: string): Promise<void> {
  const currentSubscription = await this._subscriptionRepository.findActiveByOwnerId(ownerId);
  if (!currentSubscription) {
    throw new AppError("No active subscription found", STATUS_CODES.BAD_REQUEST);
  }

  const currentPlan = currentSubscription.planId as ISubscriptionPlan;

  const newPlan = await this._subscriptionPlanRepository.findById(newPlanId);
  if (!newPlan) throw new AppError("Plan not found", STATUS_CODES.NOT_FOUND);

  if (newPlan.price <= currentPlan.price) {
    throw new AppError(
      "Upgrade is only allowed to a higher-priced plan",
      STATUS_CODES.BAD_REQUEST
    );
  }

  const now = new Date();
  const endDate = new Date(currentSubscription.endDate);
  const startDate = new Date(currentSubscription.startDate);

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const credit = (remainingDays / totalDays) * currentPlan.price;
  const proratedAmount = Math.max(0, Math.round(newPlan.price - credit));

  // Expire the current subscription
  await this._subscriptionRepository.update(currentSubscription._id.toString(), {
    status: "Expired",
  } as any);

  // Create new upgraded subscription (same endDate as old one)
  await this._subscriptionRepository.createSubscription({
    ownerId,
    planId: newPlanId,
    startDate: now,
    endDate: currentSubscription.endDate,
    status: "Active",
    paymentId,
    isUpgrade: true,
    transactionType: "Upgrade",
    originalAmount: newPlan.price,
    proratedAmount,
    upgradedFrom: currentSubscription._id,
  });
}



}
