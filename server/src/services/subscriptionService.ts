

import { injectable, inject } from "tsyringe";
import { TOKENS } from "../config/tokens";
import { ISubscriptionPlanRepository } from "../repositories/interfaces/ISubscriptionPlanRepository";
import { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { IPropertyRepository } from "../repositories/interfaces/IPropertyRepository";
import { ISubscriptionService } from "./interfaces/ISubscriptionService";
import { SubscriptionPlanMapper } from "../mappers/subscriptionPlanMapper";
import { SubscriptionMapper } from "../mappers/subscriptionMapper";
import { AppError } from "../utils/AppError";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import {
  CreateSubscriptionDto,
  CurrentSubscriptionDto,
} from "../dtos/subscription.dto";
import { SubscriptionPlanResponseDto } from "../dtos/subscriptionPlan.dto";

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

    await this._subscriptionRepository.create({
      ownerId,
      planId: data.planId,
      startDate,
      endDate,
      status: "Active",
      paymentId: data.paymentId,
      isUpgrade: false,
      transactionType: "New",
      originalAmount: plan.price,
    } as any);
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
}
