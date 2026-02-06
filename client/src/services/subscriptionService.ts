import { api } from "../api/api";
import { ADMIN_API } from "../constants/apiRoutes";
import { SubscriptionPlanDto,UpdateSubscriptionPlanDto } from "../types/subscription";

export const subscriptionService= {

    getAllPlans: async ():Promise<SubscriptionPlanDto[]> => {
      const res = await api.get(ADMIN_API.SUBSCRIPTION_PLANS);
      return res.data.data;
    },

    updatePlan: async (planId:string, data: UpdateSubscriptionPlanDto):Promise<SubscriptionPlanDto> => {
      const res = await api.patch(ADMIN_API.UPDATE_SUBSCRIPTION_PLAN(planId),data);
      return res.data.data;
    },    



}