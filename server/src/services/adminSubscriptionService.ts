import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../config/tokens';
import { ISubscriptionPlanRepository } from '../repositories/interfaces/ISubscriptionPlanRepository';
import { IAdminSubscriptionService } from './interfaces/IAdminSubscriptionService';
import { ISubscriptionPlan } from "../models/subscriptionPlan";
import { SubscriptionPlanResponseDto, UpdateSubscriptionPlanDto } from "../dtos/subscriptionPlan.dto";
import { SubscriptionPlanMapper } from "../mappers/subscriptionPlanMapper";


@injectable()
export class AdminSubscriptionService implements IAdminSubscriptionService {
  constructor(
    @inject(TOKENS.ISubscriptionPlanRepository) private _subscriptionPlanRepository: ISubscriptionPlanRepository,

  ) {}

  async getAllPlans(): Promise<SubscriptionPlanResponseDto[]> {
    //return this._subscriptionRepository.findAll();
    const plans = await this._subscriptionPlanRepository.findAll();
    return SubscriptionPlanMapper.toResponseDtoList(plans);
  }

    async updatePlan(
    planId: string,
    data: UpdateSubscriptionPlanDto
  ): Promise<SubscriptionPlanResponseDto | null> {
   // return this._subscriptionRepository.update(planId, data);
       const updated = await this._subscriptionPlanRepository.update(planId, data);
    return updated ? SubscriptionPlanMapper.toResponseDto(updated) : null;
  }

}